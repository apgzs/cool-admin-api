import { Application } from 'egg';
import { Middleware } from 'koa';

/** http装饰器方法类型 */
declare type HttpFunction = (url: string, ...beforeMiddlewares: Middleware[]) => any;

declare class RouterDecorator {
    get: HttpFunction;
    post: HttpFunction;
    patch: HttpFunction;
    del: HttpFunction;
    options: HttpFunction;
    put: HttpFunction;
    /**
     * 记录各个class的prefix以及相关中间件
     * 最后统一设置
     * @private
     * @static
     * @type {ClassPrefix}
     * @memberof RouterDecorator
     */
    private static __classPrefix__;
    /**
     * 记录各个routerUrl的路由配置
     * 最后统一设置
     * @private
     * @static
     * @type {Router}
     * @memberof RouterDecorator
     */
    private static __router__;

    constructor ();

    /** 推入路由配置 */
    private __setRouter__;

    /**
     * 装饰Controller class的工厂函数
     * 为一整个controller添加prefix
     * 可以追加中间件
     * @param {string} prefixUrl
     * @param {...Middleware[]} beforeMiddlewares
     * @param {[]} baseFn 配置通用的接口 可选 page、add、update、delete、info、list
     * @returns 装饰器函数
     * @memberof RouterDecorator
     */
    prefix (prefixUrl: string, baseFn?: any[], ...beforeMiddlewares: Middleware[]): (targetControllerClass: any) => any;

    /**
     * 注册路由
     * 路由信息是通过装饰器收集的
     * @export
     * @param {Application} app eggApp实例
     * @param {string} [options={ prefix: '' }] 举例： { prefix: '/api' }
     */
    static initRouter (app: Application, options?: {
        prefix: string;
    }): void;
}

/** 暴露注册路由方法 */
export declare const initRouter: typeof RouterDecorator.initRouter;
declare const _default: RouterDecorator;
/** 暴露实例的prefix和http的各个方法 */
export default _default;
