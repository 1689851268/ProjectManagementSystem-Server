import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/Notification';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationListQuery, NotificationQuery } from './utils/interfaces';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) {}

    findAll() {
        return this.notificationRepository.findAndCount();
    }

    findOne(id: number) {
        return this.notificationRepository.findOne({ where: { id } });
    }

    // 根据 title 模糊查询; 分页; 按发布时间降序排列
    find(notificationQuery: NotificationQuery) {
        const { title, curPage, pageSize } = notificationQuery;
        return this.notificationRepository
            .createQueryBuilder('notification')
            .select([
                'notification.id',
                'notification.title',
                'notification.content',
                'notification.lastUpdateTime',
            ])
            .where('notification.title LIKE :title', {
                title: `%${title}%`,
            })
            .orderBy('notification.lastUpdateTime', 'DESC')
            .skip((curPage - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
    }

    // 根据 title, publisher, lastUpdater 模糊查询; 分页; 按发布时间降序排列
    findList(notificationListQuery: NotificationListQuery) {
        const { title, curPage, pageSize, publisher, lastUpdater } =
            notificationListQuery;
        return this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoin('notification.publisher', 'publisher')
            .leftJoin('notification.lastUpdater', 'lastUpdater')
            .where('notification.title LIKE :title', {
                title: `%${title}%`,
            })
            .andWhere('publisher.name LIKE :publisher', {
                publisher: `%${publisher}%`,
            })
            .andWhere('lastUpdater.name LIKE :lastUpdater', {
                lastUpdater: `%${lastUpdater}%`,
            })
            .select([
                'notification.id',
                'notification.title',
                'notification.content',
                'notification.lastUpdateTime',
                'notification.publishTime',
                'publisher.id',
                'publisher.name',
                'lastUpdater.id',
                'lastUpdater.name',
            ])
            .orderBy('notification.publishTime', 'DESC')
            .skip((curPage - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
    }

    // 根据 notification-id 查询 notification
    async getNotificationById(id: number) {
        // 使用 QueryBuilder
        // 通过 notification-id 查询 notification 和 notificationAttachment
        // 通过 publisher 和 lastUpdater 查询 teacher
        const res = await this.notificationRepository
            .createQueryBuilder('notification')
            .select([
                'notification.id',
                'notification.title',
                'notification.content',
                'notification.lastUpdateTime',
                'notification.publishTime',
                'notificationAttachment.name',
                'notificationAttachment.storagePath',
                'publisher.name',
                'lastUpdater.name',
            ])
            .leftJoin(
                'notification.notificationAttachments',
                'notificationAttachment',
            )
            .leftJoin('notification.publisher', 'publisher')
            .leftJoin('notification.lastUpdater', 'lastUpdater')
            .where('notification.id = :id', { id })
            .getOne();
        return res || {};
    }

    async findAttachment() {
        const notification = await this.findOne(1);
        console.log('notification', notification);
        return this.notificationRepository.find({
            // where: notification, // 一对多 / 多对多
            relations: {
                notificationAttachments: true,
            },
        });
    }

    // 创建通知
    create(createNotificationDto: CreateNotificationDto) {
        const newNotification = this.notificationRepository.create(
            createNotificationDto,
        );
        return this.notificationRepository.save(newNotification);
    }

    update(id: number, notification: Partial<Notification>) {
        return this.notificationRepository.update(id, notification);
    }

    remove(id: number) {
        return this.notificationRepository.delete(id);
    }
}
