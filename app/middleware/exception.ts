import { Context } from 'egg';
import * as moment from 'moment';

/**
 * 统一异常处理
 * @constructor
 */
export default function Exception (): any {
    return async (ctx: Context, next: () => Promise<any>) => {
        try {
            await next();
        } catch (err) {
            const { message, errors } = err;
            ctx.logger.error(`>>>${ moment().format('YYYY-MM-DD HH:mm:ss') }:`, message, errors);
            ctx.body = {
                code: 1001,
                message,
            };
        }
    };
}
