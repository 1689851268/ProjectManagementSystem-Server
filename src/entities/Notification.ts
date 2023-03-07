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
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('varchar', { length: 20 })
    title: string;

    @Column('datetime', { comment: '发布时间' })
    publishTime: Date;

    @Column('datetime', { comment: '最后更新时间' })
    lastUpdateTime: Date;

    @Column('enum', {
        comment: '是否置顶',
        enum: ['1', '0'],
        default: '0',
    })
    isOnTop: '1' | '0';

    @OneToMany(
        () => NotificationAttachment,
        (notificationAttachment) => notificationAttachment.notificationId,
    )
    notificationAttachments: NotificationAttachment[];

    @ManyToOne(() => Teacher, (teacher) => teacher.notifications)
    @JoinColumn([{ name: 'publisher', referencedColumnName: 'id' }])
    publisher: Teacher;

    @ManyToOne(() => Teacher, (teacher) => teacher.notifications)
    @JoinColumn([{ name: 'lastUpdater', referencedColumnName: 'id' }])
    lastUpdater: Teacher;
}
