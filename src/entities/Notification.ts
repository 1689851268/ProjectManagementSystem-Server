import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
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

    @Column('varchar', { length: 255 })
    content: string;

    @CreateDateColumn({ comment: '发布时间' })
    publishTime: Date;

    @UpdateDateColumn({ comment: '最后更新时间' })
    lastUpdateTime: Date;

    @Column('enum', {
        comment: '是否置顶',
        enum: ['1', '0'],
        default: '0',
    })
    isOnTop: '1' | '0';

    @ManyToOne(() => Teacher, (teacher) => teacher.newNotifications)
    @JoinColumn([{ name: 'publisher', referencedColumnName: 'id' }])
    publisher: Teacher;

    @ManyToOne(() => Teacher, (teacher) => teacher.oldNotifications)
    @JoinColumn([{ name: 'lastUpdater', referencedColumnName: 'id' }])
    lastUpdater: Teacher;

    @OneToMany(
        () => NotificationAttachment,
        (notificationAttachment) => notificationAttachment.notificationId,
    )
    notificationAttachments: NotificationAttachment[];
}
