import { BaseEntity } from 'egg-cool-entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'user' })
export default class User extends BaseEntity {
    // 用户名
    @Column()
    name: string;
    // 昵称
    @Column()
    nickName: string;

}
