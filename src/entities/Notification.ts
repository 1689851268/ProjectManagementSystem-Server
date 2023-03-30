import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './Teacher';
import { NotificationAttachment } from './NotificationAttachment';

@Index('PublisherForTeacher', ['publisher'], {})
@Index('LastUpdaterForTeacher', ['lastUpdater'], {})
@Entity()
export class Notification {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 20 })
    title: string;

    @Column('text') // 'text' 是 MySQL 的类型, 用于存储大量文本
    content: string;

    @Column('varchar', { length: 13, comment: '发布时间' })
    publishTime: string;

    @Column('varchar', { length: 13, comment: '最后更新时间' })
    lastUpdateTime: string;

    @ManyToOne(() => Teacher, (teacher) => teacher.newNotifications)
    @JoinColumn([{ name: 'publisher', referencedColumnName: 'id' }])
    publisher: number;

    @ManyToOne(() => Teacher, (teacher) => teacher.oldNotifications)
    @JoinColumn([{ name: 'lastUpdater', referencedColumnName: 'id' }])
    lastUpdater: number;

    @OneToMany(
        () => NotificationAttachment,
        (notificationAttachment) => notificationAttachment.notificationId,
    )
    notificationAttachments: NotificationAttachment[];
}
