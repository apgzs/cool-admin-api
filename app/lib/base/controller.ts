import { Controller, Context } from 'egg';
import routerDecorator from '../router';
import { Brackets } from 'typeorm';

// 返回参数配置
interface ResOp {
    // 返回数据
    data?: any;
    // 是否成功
    isFail?: boolean;
    // 返回码
    code?: number;
    // 返回消息
    message?: string;
}

// 分页参数配置
interface PageOp {
    // 模糊查询字段
    keyWordLikeFields?: string[];
    // where
    where?: Brackets;
    // 全匹配 "=" 字段
    fieldEq?: string[];
    // 排序
    addOrderBy?: {};
}

/**
 * 控制器基类
 */
export abstract class BaseController extends Controller {
    protected entity;
    protected OpService;
    protected pageOption: PageOp;

    protected constructor (ctx: Context) {
        super(ctx);
        this.OpService = this.service.comm.data;
    }

    /**
     * 设置服务
     * @param service
     */
    protected setService (service) {
        this.OpService = service;
    }

    /**
     * 配置分页查询
     * @param option
     */
    protected setPageOption (option: PageOp) {
        this.pageOption = option;
    }

    /**
     * 设置操作实体
     * @param entity
     */
    protected setEntity (entity) {
        this.entity = entity;
    }

    /**
     * 分页查询数据
     */
    @routerDecorator.get('/page')
    protected async page () {
        const result = await this.OpService.page(this.ctx.query, this.pageOption, this.entity);
        this.res({ data: result });
    }

    /**
     * 数据列表
     */
    @routerDecorator.get('/list')
    protected async list () {
        const result = await this.OpService.list(this.entity);
        this.res({ data: result });
    }

    /**
     * 信息
     */
    @routerDecorator.get('/info')
    protected async info () {
        const result = await this.OpService.info(this.ctx.query.id, this.entity);
        this.res({ data: result });
    }

    /**
     * 新增
     */
    @routerDecorator.post('/add')
    protected async add () {
        await this.OpService.addOrUpdate(this.ctx.request.body, this.entity);
        this.res();
    }

    /**
     * 修改
     */
    @routerDecorator.post('/update')
    protected async update () {
        await this.OpService.addOrUpdate(this.ctx.request.body, this.entity);
        this.res();
    }

    /**
     * 删除
     */
    @routerDecorator.post('/delete')
    protected async delete () {
        await this.OpService.delete(this.ctx.request.body.ids, this.entity);
        this.res();
    }

    /**
     * 返回数据
     * @param op 返回配置，返回失败需要单独配置
     */
    protected res (op?: ResOp) {
        if (!op) {
            this.ctx.body = {
                code: 1000,
                message: 'success',
            };
            return;
        }
        if (op.isFail) {
            this.ctx.body = {
                code: op.code ? op.code : 1001,
                data: op.data,
                message: op.message ? op.message : 'fail',
            };
        } else {
            this.ctx.body = {
                code: op.code ? op.code : 1000,
                message: op.message ? op.message : 'success',
                data: op.data,
            };
        }
    }

}
