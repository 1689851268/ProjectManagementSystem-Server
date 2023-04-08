import { NotificationAttachment } from '@/entities/NotificationAttachment';
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
        @InjectRepository(NotificationAttachment)
        private readonly notificationAttachmentRepository: Repository<NotificationAttachment>,
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
                'notificationAttachment.id',
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
        return this.notificationRepository.find({
            // where: notification, // 一对多 / 多对多
            relations: {
                notificationAttachments: true,
            },
        });
    }

    // 创建通知
    async create(createNotificationDto: CreateNotificationDto) {
        const { attachment, ...rest } = createNotificationDto;
        const temp = this.notificationRepository.create(rest);
        const notification = await this.notificationRepository.save(temp);

        // 如果有附件, 则插入 notificationAttachment 表
        let attachmentArr: any = null;
        if (attachment.length > 0) {
            // attachment 为一个数组, { name, url } 为数组的元素
            // 使用 QueryBuilder, 更新 notificationAttachments 表的 name, url, notificationId
            // 为 attachment 数组元素的 name, url 和 notification.id
            attachmentArr = await this.notificationAttachmentRepository
                .createQueryBuilder()
                .insert()
                .into(NotificationAttachment)
                .values(
                    attachment.map((item) => ({
                        name: item.name,
                        storagePath: item.url,
                        notificationId: notification.id,
                    })),
                )
                .execute();
        }

        return { notification, attachmentArr };
    }

    async update(id: number, notification: Partial<CreateNotificationDto>) {
        const { attachment, ...rest } = notification;
        // 使用 QueryBuilder, 根据 id 更新 notification 表: title, content, lastUpdateTime, lastUpdater
        const newNotification = await this.notificationRepository
            .createQueryBuilder()
            .update(Notification)
            .set(rest)
            .where('id = :id', { id })
            .execute();

        // 先删除 notificationAttachment 表中 notificationId 为 id 的数据
        await this.notificationAttachmentRepository
            .createQueryBuilder()
            .delete()
            .from(NotificationAttachment)
            .where('notificationId = :id', { id })
            .execute();

        // 如果有附件, 则插入 notificationAttachment 表
        let attachmentArr: any = null;
        if (attachment.length > 0) {
            // attachment 为一个数组, { name, url } 为数组的元素
            // 使用 QueryBuilder, 更新 notificationAttachments 表的 name, url, notificationId
            // 为 attachment 数组元素的 name, url 和 notification.id
            attachmentArr = await this.notificationAttachmentRepository
                .createQueryBuilder()
                .insert()
                .into(NotificationAttachment)
                .values(
                    attachment.map((item) => ({
                        name: item.name,
                        storagePath: item.url,
                        notificationId: id,
                    })),
                )
                .execute();
        }

        return { newNotification, attachmentArr, status: 201 };
    }

    // 教师根据 id 删除通知
    async remove(id: number) {
        // 先删除 notificationAttachment 表中 notificationId 为 id 的数据
        await this.notificationAttachmentRepository
            .createQueryBuilder()
            .delete()
            .from(NotificationAttachment)
            .where('notificationId = :id', { id })
            .execute();

        // 再删除 notification 表中 id 为 id 的数据
        const res = await this.notificationRepository
            .createQueryBuilder()
            .delete()
            .from(Notification)
            .where('id = :id', { id })
            .execute();

        // 返回删除的数据条数
        return res.affected;
    }

    // 根据 id 获取通知详情, 包括 title, content, attachment
    getNotificationDetailById(id: number) {
        return this.notificationRepository
            .createQueryBuilder('notification')
            .select([
                'notification.id',
                'notification.title',
                'notification.content',
                'notificationAttachment.name',
                'notificationAttachment.storagePath',
            ])
            .leftJoin(
                'notification.notificationAttachments',
                'notificationAttachment',
            )
            .where('notification.id = :id', { id })
            .getOne();
    }
}
