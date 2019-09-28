import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
// 实体类基类
export abstract class BaseEntity {
    // ID
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;
    // 创建时间
    @Index()
    @CreateDateColumn()
    createTime: Date;
    // 更新时间
    @UpdateDateColumn()
    updateTime: Date;
}
