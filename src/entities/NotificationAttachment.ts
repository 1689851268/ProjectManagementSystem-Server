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
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 50 })
    name: string;

    @Column('varchar', { length: 100 })
    storagePath: string;

    @ManyToOne(
        () => Notification,
        (notification) => notification.notificationAttachments,
    )
    @JoinColumn([{ name: 'notificationId', referencedColumnName: 'id' }])
    notificationId: number;
}
