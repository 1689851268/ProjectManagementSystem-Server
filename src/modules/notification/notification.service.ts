import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/Notification';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQuery } from './utils/interfaces';

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

    // 根据 title 模糊查询, 并分页
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
            .skip((curPage - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
    }

    findPublisher(id: number) {
        console.log('id', id);
        // return this.notificationRepository.findAndCount({
        //     where: {
        //         id,
        //     },
        //     relations: {
        //         publisher: true,
        //     },
        // });
    }

    findLastUpdater(id: number) {
        console.log('id', id);
        // return this.notificationRepository.findAndCount({
        //     where: {
        //         id, // 多对一 / 一对一
        //     },
        //     relations: {
        //         publisher: true,
        //     },
        // });
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
