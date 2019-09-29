import { BaseController } from '../lib/base/controller';
import routerDecorator from '../lib/router';
import { Context } from 'egg';

@routerDecorator.prefix('/user', [ 'add', 'delete', 'update', 'info', 'list', 'page' ])
export default class User extends BaseController {
    constructor (ctx: Context) {
        super(ctx);
        this.setEntity(this.ctx.repo.User);
    }
}
