import { Service, Context } from 'egg';
import { getManager, getConnection, Brackets } from 'typeorm';
import * as _ from 'lodash';
// 基础配置
const conf = {
    size: 15,
    errTips: {
        noEntity: '未设置操作实体~',
    },
};

/**
 * 服务基类
 */
export abstract class BaseService extends Service {
    public sqlParams;

    public constructor (ctx: Context) {
        super(ctx);
        this.sqlParams = [];
    }

    /**
     * 执行SQL并获得分页数据
     * @param sql 执行的sql语句
     * @param query 分页查询条件
     */
    public async sqlRenderPage (sql, query) {
        const { size = conf.size, page = 1, order = 'createTime', sort = 'desc' } = query;
        if (order && sort) {
            if (!await this.paramSafetyCheck(order + sort)) {
                throw new Error('非法传参~');
            }
            sql += ` ORDER BY ${ order } ${ sort }`;
        }
        this.sqlParams.push((page - 1) * size);
        this.sqlParams.push(parseInt(size));
        sql += ' LIMIT ?,? ';
        let params = [];
        params = params.concat(this.sqlParams);
        const result = await this.nativeQuery(sql, params);
        const countResult = await this.nativeQuery(this.getCountSql(sql), params);
        return {
            list: result,
            pagination: {
                page: parseInt(page),
                size: parseInt(size),
                total: parseInt(countResult[0] ? countResult[0].count : 0),
            },
        };
    }

    /**
     * 原生查询
     * @param sql
     * @param params
     */
    public async nativeQuery (sql, params?) {
        if (_.isEmpty(params)) {
            params = this.sqlParams;
        }
        let newParams = [];
        newParams = newParams.concat(params);
        this.sqlParams = [];
        return await this.getOrmManager().query(sql, newParams);
    }

    /**
     * 参数安全性检查
     * @param params
     */
    public async paramSafetyCheck (params) {
        const lp = params.toLowerCase();
        return !(lp.indexOf('update') > -1 || lp.indexOf('select') > -1 || lp.indexOf('delete') > -1 || lp.indexOf('insert') > -1);
    }

    /**
     * 获得查询个数的SQL
     * @param sql
     */
    public getCountSql (sql) {
        sql = sql.toLowerCase();
        return `select count(*) as count from (${ sql.split('limit')[0] }) a`;
    }

    /**
     * 单表分页查询
     * @param entity
     * @param query
     * @param option
     */
    public async page (query, option, entity) {
        if (!entity) throw new Error(conf.errTips.noEntity);
        const find = await this.getPageFind(query, option, entity);
        return this.renderPage(await find.getManyAndCount(), query);
    }

    /**
     * 所有数据
     * @param entity
     */
    public async list (entity) {
        if (!entity) throw new Error(conf.errTips.noEntity);
        return await entity.find();
    }

    /**
     * 新增/修改
     * @param entity 实体
     * @param param 数据
     */
    public async addOrUpdate (param, entity) {
        if (!entity) throw new Error(conf.errTips.noEntity);
        if (param.id) {
            await entity.update(param.id, param);
        } else {
            await entity.save(param);
        }
    }

    /**
     * 根据ID获得信息
     * @param entity 实体
     * @param id id
     */
    public async info (id, entity) {
        if (!entity) throw new Error(conf.errTips.noEntity);
        return await entity.findOne({ id });
    }

    /**
     * 删除
     * @param entity
     * @param ids
     */
    public async delete (ids, entity) {
        if (!entity) throw new Error(conf.errTips.noEntity);
        if (ids instanceof Array) {
            await entity.delete(ids);
        } else {
            await entity.delete(ids.split(','));
        }
    }

    /**
     * query
     * @param data
     * @param query
     */
    public renderPage (data, query) {
        const { size = conf.size, page = 1 } = query;
        return {
            list: data[0],
            pagination: {
                page: parseInt(page),
                size: parseInt(size),
                total: data[1],
            },
        };
    }

    /**
     * 构造分页查询条件
     *  @param entity 实体
     *  @param query 查询条件
     *  @param option 配置信息
     */
    public getPageFind (query, option, entity) {
        let { size = conf.size, page = 1, order = 'createTime', sort = 'desc', keyWord = '' } = query;
        const find = entity
            .createQueryBuilder()
            .take(parseInt(size))
            .skip(String((page - 1) * size))
            .where(option.where);
        // 附加排序
        if (!_.isEmpty(option.addOrderBy)) {
            for (const key in option.addOrderBy) {
                find.addOrderBy(key, option.addOrderBy[key].toUpperCase());
            }
        }
        // 接口请求的排序
        if (sort && order) {
            find.addOrderBy(order, sort.toUpperCase());
        }
        // 关键字模糊搜索
        if (keyWord) {
            keyWord = `%${ keyWord }%`;
            find.andWhere(new Brackets(qb => {
                const keyWordLikeFields = option.keyWordLikeFields;
                for (let i = 0; i < option.keyWordLikeFields.length; i++) {
                    qb.orWhere(`${ keyWordLikeFields[i] } like :keyWord`, { keyWord });
                }
            }));
        }
        // 字段全匹配
        if (!_.isEmpty(option.fieldEq)) {
            for (const key of option.fieldEq) {
                const c = {};
                if (query[key]) {
                    c[key] = query[key];
                    find.andWhere(`${ key } = :${ key }`, c);
                }
            }
        }
        return find;
    }

    /**
     * 设置sql
     * @param condition 条件是否成立
     * @param sql sql语句
     * @param params 参数
     */
    protected setSql (condition, sql, params?: any[]) {
        let rSql = false;
        if (condition || (condition === 0 && condition !== '')) {
            rSql = true;
            this.sqlParams = this.sqlParams.concat(params);
        }
        return rSql ? sql : '';
    }

    /**
     * 获得上下文
     */
    public getContext () {
        return this.ctx;
    }

    /**
     * 获得ORM操作对象
     */
    public getRepo () {
        return this.ctx.repo;
    }

    /**
     * 获得ORM管理
     */
    public getOrmManager () {
        return getManager();
    }

    /**
     * 获得ORM连接类
     */
    public getOrmConnection () {
        return getConnection();
    }

}
