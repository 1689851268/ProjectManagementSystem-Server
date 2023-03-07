import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './Notification';

@Index('AttachmentForNotification', ['notificationId'], {})
@Entity()
export class NotificationAttachment {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('varchar', { length: 20 })
    name: string;

    @Column('varchar', { length: 100 })
    storagePath: string;

    @ManyToOne(
        () => Notification,
        (notification) => notification.notificationAttachments,
    )
    @JoinColumn([{ name: 'notificationId', referencedColumnName: 'id' }])
    notificationId: Notification;
}
