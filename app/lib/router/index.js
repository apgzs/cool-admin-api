"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const _ = require('lodash');
const tslib_1 = require("tslib");
/** http方法名 */
const HTTP_METHODS = ['get', 'post', 'patch', 'del', 'options', 'put'];

let baseControllerArr = [];

class RouterDecorator {
    constructor() {
        HTTP_METHODS.forEach(httpMethod => {
            this[httpMethod] = (url, ...beforeMiddlewares) => (target, name) => {
                const routerOption = {
                    httpMethod,
                    beforeMiddlewares,
                    handlerName: name,
                    constructorFn: target.constructor,
                    className: target.constructor.name,
                    url: url
                };
                if (target.constructor.name === 'BaseController') {
                    baseControllerArr.push(routerOption)
                } else {
                    this.__setRouter__(url, routerOption);
                }
            };
        });
    }

    /** 推入路由配置 */
    __setRouter__(url, routerOption) {
        RouterDecorator.__router__[url] = RouterDecorator.__router__[url] || [];
        RouterDecorator.__router__[url].push(routerOption);
    }

    /**
     * 装饰Controller class的工厂函数
     * 为一整个controller添加prefix
     * 可以追加中间件
     * @param {string} prefixUrl
     * @param {...Middleware[]} beforeMiddlewares
     * @param {any[]} baseFn
     * @returns 装饰器函数
     * @memberof RouterDecorator
     */
    prefix(prefixUrl, baseFn = [], ...beforeMiddlewares) {
        return function (targetControllerClass) {
            RouterDecorator.__classPrefix__[targetControllerClass.name] = {
                prefix: prefixUrl,
                beforeMiddlewares: beforeMiddlewares,
                baseFn: baseFn,
                target: targetControllerClass
            };
            return targetControllerClass;
        };
    }

    /**
     * 注册路由
     * 路由信息是通过装饰器收集的
     * @export
     * @param {Application} app eggApp实例
     * @param {string} [options={ prefix: '' }] 举例： { prefix: '/api' }
     */
    static initRouter(app, options = {prefix: ''}) {
        let addUrl = [];
        Object.keys(RouterDecorator.__router__).forEach(url => {
            RouterDecorator.__router__[url].forEach((opt) => {
                const controllerPrefixData = RouterDecorator.__classPrefix__[opt.className] || {
                    prefix: '',
                    beforeMiddlewares: [],
                    baseFn: [],
                    target: {}
                };
                let fullUrl = `${options.prefix}${controllerPrefixData.prefix}${url}`;
                console.log(`>>>>>>>>custom register URL * ${opt.httpMethod.toUpperCase()} ${fullUrl} * ${opt.className}.${opt.handlerName}`);
                if (!addUrl.includes(fullUrl)) {
                    app.router[opt.httpMethod](fullUrl, ...controllerPrefixData.beforeMiddlewares, ...opt.beforeMiddlewares, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const ist = new opt.constructorFn(ctx);
                        yield ist[opt.handlerName](ctx);
                    }));
                    addUrl.push(fullUrl);
                }
            });
        });
        // 通用方法
        const cArr = [].concat(_.uniq(baseControllerArr));
        Object.keys(RouterDecorator.__classPrefix__).forEach(cl => {
            const controllerPrefixData = RouterDecorator.__classPrefix__[cl] || {
                prefix: '',
                beforeMiddlewares: [],
                baseFn: [],
                target: {}
            };
            const setCArr = cArr.filter(c => {
                if (RouterDecorator.__classPrefix__[cl].baseFn.includes(c.url.replace('/', ''))) {
                    return c;
                }
            });
            setCArr.forEach(cf => {
                let fullUrl = `${options.prefix}${controllerPrefixData.prefix}${cf.url}`;
                console.log(`>>>>>>>>comm register URL * ${cf.httpMethod.toUpperCase()} ${fullUrl} * ${cl}.${cf.handlerName}`);
                app.router[cf.httpMethod](fullUrl, ...controllerPrefixData.beforeMiddlewares, ...cf.beforeMiddlewares, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const ist = new controllerPrefixData.target(ctx);
                    yield ist[cf.handlerName](ctx);
                }));
            });
        });
    }
}

/**
 * 记录各个class的prefix以及相关中间件
 * 最后统一设置
 * @private
 * @static
 * @type {ClassPrefix}
 * @memberof RouterDecorator
 */
RouterDecorator.__classPrefix__ = {};
/**
 * 记录各个routerUrl的路由配置
 * 最后统一设置
 * @private
 * @static
 * @type {Router}
 * @memberof RouterDecorator
 */
RouterDecorator.__router__ = {};
/** 暴露注册路由方法 */
exports.initRouter = RouterDecorator.initRouter;
/** 暴露实例的prefix和http的各个方法 */
exports.default = new RouterDecorator();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBb0NBLGNBQWM7QUFDZCxNQUFNLFlBQVksR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFLdkUsTUFBTSxlQUFlO0lBNkJqQjtRQUNJLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBVyxFQUFFLEdBQUcsaUJBQStCLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBVyxFQUFFLElBQVksRUFBRSxFQUFFO2dCQUNsRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRTtvQkFDcEIsVUFBVTtvQkFDVixpQkFBaUI7b0JBQ2pCLFdBQVcsRUFBRSxJQUFJO29CQUNqQixhQUFhLEVBQUUsTUFBTSxDQUFDLFdBQVc7b0JBQ2pDLFNBQVMsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUk7aUJBQ3JDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQTtRQUNMLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELGFBQWE7SUFDTCxhQUFhLENBQUUsR0FBVyxFQUFFLFlBQTBCO1FBQzFELGVBQWUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEUsZUFBZSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksTUFBTSxDQUFFLFNBQWlCLEVBQUUsR0FBRyxpQkFBK0I7UUFDaEUsT0FBTyxVQUFVLHFCQUFxQjtZQUNsQyxlQUFlLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxHQUFHO2dCQUMxRCxNQUFNLEVBQUUsU0FBUztnQkFDakIsaUJBQWlCLEVBQUUsaUJBQWlCO2FBQ3ZDLENBQUM7WUFDRixPQUFPLHFCQUFxQixDQUFDO1FBQ2pDLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFFLEdBQWdCLEVBQUUsT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTtRQUNoRSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbEQsZUFBZSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFpQixFQUFFLEVBQUU7Z0JBQzFELE1BQU0sb0JBQW9CLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxDQUFDO2dCQUNySCxNQUFNLE9BQU8sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsb0JBQW9CLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUN4RSxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxJQUFJLE9BQU8sTUFBTSxHQUFHLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2dCQUNwSSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxvQkFBb0IsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFPLEdBQUcsRUFBRSxFQUFFO29CQUNuSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEMsQ0FBQyxDQUFBLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztBQTlFRDs7Ozs7OztHQU9HO0FBQ1ksK0JBQWUsR0FBZ0IsRUFBRSxDQUFBO0FBRWhEOzs7Ozs7O0dBT0c7QUFDWSwwQkFBVSxHQUFXLEVBQUUsQ0FBQTtBQStEMUMsZUFBZTtBQUNGLFFBQUEsVUFBVSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUM7QUFFckQsNEJBQTRCO0FBQzVCLGtCQUFlLElBQUksZUFBZSxFQUFFLENBQUMifQ==
