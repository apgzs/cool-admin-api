import { BaseController } from 'egg-cool-controller';
import router from 'egg-cool-router';

@router.prefix('/user', [ 'add', 'delete', 'update', 'info', 'list', 'page' ])
export default class User extends BaseController {
    init() {
        this.setEntity(this.ctx.repo.User);
        this.setService(this.service.user);
    }
}
