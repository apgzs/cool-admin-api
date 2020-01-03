## 展示
* 演示地址：https://show.cool-admin.com
* 文档地址：https://docs.cool-admin.com
* 官网：https://www.cool-admin.com

## 技术选型
Node版后台基础框架基于[Egg.js](https://eggjs.org/zh-cn/)(阿里出品)
* 基础：**[egg.js](https://eggjs.org/zh-cn/)**
* 数据：**[typeorm](https://typeorm.io)**
* 缓存：**[egg-redis](https://www.npmjs.com/package/egg-redis)** 
* 鉴权：**[egg-jwt](https://www.npmjs.com/package/egg-jwt)** 
* 网络：**[axios](https://www.npmjs.com/package/axios)** 

## 核心组件
独有cool-admin.com发布的npm组件
* 路由：**[egg-cool-router](https://www.npmjs.com/package/egg-cool-router)**
* 控制器：**[egg-cool-controller](https://www.npmjs.com/package/egg-cool-controller)**
* 服务层：**[egg-cool-service](https://www.npmjs.com/package/egg-cool-service)** 
* 缓存：**[egg-cool-cache](https://www.npmjs.com/package/egg-cool-cache)** 
* 模型：**[egg-cool-entity](https://www.npmjs.com/package/egg-cool-entity)** 

## 运行
 环境 `Node.js>=8.9.0` `Redis` `mysql`
 
 新建并导入数据库,修改数据库连接信息
 
 推荐使用`yarn`
 
```js
 git clone https://github.com/apgzs/cool-admin-api.git
 cd cool-admin-api
 yarn
 yarn dev
 http://localhost:7001
```
 
 或者`npm`
 
```js 
 git clone https://github.com/apgzs/cool-admin-api.git
 cd cool-admin-api
 npm install
 npm run dev
 http://localhost:7001
```

![努力开发中](https://cool-admin.com/img/work1.png)

![努力开发中](https://cool-admin.com/img/work2.png)

![努力开发中](https://cool-admin.com/img/work3.png)

 ## 快速开发6个接口 （演示视频： https://www.bilibili.com/video/av69398358/）

 ## 数据模型
  数据模型必须放在`app/entities/*`下，否则[typeorm](https://typeorm.io "typeorm")无法识别，如:
```js
 import { Entity, Column, Index } from 'typeorm';
 import { BaseEntity } from 'egg-cool-entity';
 /**
  * 系统角色
  */
 @Entity({ name: 'sys_role' })
 export default class SysRole extends BaseEntity {
     // 名称
     @Index({ unique: true })
     @Column()
     name: string;
     // 角色标签
     @Index({ unique: true })
     @Column({ nullable: true })
     label: string;
     // 备注
     @Column({ nullable: true })
     remark: string;
 }
```
新建完成运行代码，就可以看到数据库新建了一张`sys_role`表，如不需要自动创建`config`文件夹下修改[typeorm](https://typeorm.io "typeorm")的配置文件

## 控制器
有了数据表之后，如果希望通过接口对数据表进行操作，我们就必须在`controller`文件夹下新建对应的控制器，如：
```js
import { BaseController } from 'egg-cool-controller';
import { Context } from 'egg';
import routerDecorator from 'egg-cool-router';
import { Brackets } from 'typeorm';
/**
 * 系统-角色
 */
@routerDecorator.prefix('/admin/sys/role', [ 'add', 'delete', 'update', 'info', 'list', 'page' ])
export default class SysRoleController extends BaseController {
    constructor (ctx: Context) {
        super(ctx);
        this.setEntity(this.ctx.repo.sys.Role);
        this.setPageOption({
            keyWordLikeFields: [ 'name', 'label' ],
            where: new Brackets(qb => {
                qb.where('id !=:id', { id: 1 });
            }),
        });//分页配置（可选）
        this.setService(this.service.sys.role);//设置自定义的service（可选）
    }
}
```
这样我们就完成了6个接口的编写，对应的接口如下：
* **`/admin/sys/role/add`** 新增
* **`/admin/sys/role/delete`** 删除
* **`/admin/sys/role/update`** 更新
* **`/admin/sys/role/info`** 单个信息
* **`/admin/sys/role/list`** 列表信息
* **`/admin/sys/role/page`** 分页查询(包含模糊查询、字段全匹配等)

#### PageOption配置参数

| 参数  | 类型  | 说明  |
| ------------ | ------------ | ------------ |
| keyWordLikeFields  | 数组  | 模糊查询需要匹配的字段，如`[ 'name','phone' ]` ,这样就可以模糊查询`姓名、手机`两个字段了  |
| where | TypeORM Brackets对象  | 固定where条件设置，详见[typeorm](https://typeorm.io/#/select-query-builder "typeorm") |
| fieldEq | 数组 | 动态条件全匹配，如需要筛选用户状态`status`，就可以设置成`['status']`,此时接口就可以接受`status`的值并且对数据有过滤效果  |
| addOrderBy  |  对象 | 排序条件可传多个，如`{ sortNum:asc, createTime:desc }`  |

## 数据缓存
有些业务场景，我们并不希望每次请求接口都需要操作数据库，如：今日推荐、上个月排行榜等，数据存储在`redis`，注：缓存注解只在`service`层有效
```js
import { BaseService } from 'egg-cool-service';
import { Cache } from 'egg-cool-cache';
/**
 * 业务-排行榜服务类
 */
export default class BusRankService extends BaseService {
    /**
     * 上个月榜单
     */
    @Cache({ ttl: 1000 }) // 表示缓存
    async rankList () {
        return [ '程序猿1号', '程序猿2号', '程序猿3号' ];
    }
}
```
#### Cache配置参数
| 参数  | 类型  | 说明  |
| ------------ | ------------ | ------------ |
| resolver  | 数组  | 方法参数获得，生成key用， `resolver: (args => {return args[0];}),` 这样就可以获得方法的第一个参数作为缓存`key` |
|  ttl |  数字 |  缓存过期时间，单位：`秒` |
|  url | 字符串  |  请求url包含该前缀才缓存，如`/api/*`请求时缓存，`/admin/*`请求时不缓存 |

## 路由
[egg.js](https://eggjs.org/zh-cn/)原生的路由写法过于繁琐，`cool-admin`的路由支持`BaseController`还有其他原生支持具体参照[egg.js路由](https://eggjs.org/zh-cn/basics/router.html)

## 自定义sql查询
除了单表的简单操作，真实的业务往往需要对数据库做一些复杂的操作。这时候我们可以在`service`自定义SQL，如
```js
async page (query) {
    const { keyWord, status } = query;
    const sql = `
    SELECT
        a.*,
        GROUP_CONCAT(c.name) AS roleName
    FROM
        sys_user a
        LEFT JOIN sys_user_role b ON a.id = b.userId
        LEFT JOIN sys_role c ON b.roleId = c.id
    WHERE 1 = 1
        ${ this.setSql(status, 'and a.status = ?', [ status ]) }
        ${ this.setSql(keyWord, 'and (a.name LIKE ? or a.username LIKE ?)', [ `%${ keyWord }%`, `%${ keyWord }%` ]) }
        ${ this.setSql(true, 'and a.id != ?', [ 1 ]) }
    GROUP BY a.id`;
    return this.sqlRenderPage(sql, query);
}
```
### this.setSql()设置参数
| 参数  | 类型  | 说明  |
| ------------ | ------------ | ------------ |
| condition  | 布尔型  | 只有满足改条件才会拼接上相应的sql和参数 |
|  sql |  字符串 |  需要拼接的参数 |
|  params | 数组  |  相对应的参数 |

## 学习交流微信

lpap123456

![学习交流微信](https://i.loli.net/2019/10/24/VW1wFJMHhoGE5ra.jpg)


