import { BaseService } from 'egg-cool-service';
import { Cache } from 'egg-cool-cache';

export default class User extends BaseService {
    /**
     * 缓存的使用演示
     */
    @Cache({ ttl: 10000 })
    async list () {
        return await this.getRepo().User.find();
    }
}
