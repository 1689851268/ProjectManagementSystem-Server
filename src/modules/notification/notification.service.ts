import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/Notification';
import { Like, Repository } from 'typeorm';

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

    find(keyWord: string, page: number, pageSize: number) {
        return this.notificationRepository.findAndCount({
            where: {
                title: Like(`%${keyWord}%`),
            },
            order: {
                id: 'DESC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    findPublisher(id: number) {
        return this.notificationRepository.findAndCount({
            where: {
                id,
            },
            relations: {
                publisher: true,
            },
        });
    }

    findLastUpdater(id: number) {
        return this.notificationRepository.findAndCount({
            where: {
                id, // 多对一 / 一对一
            },
            relations: {
                publisher: true,
            },
        });
    }

    async findAttachment() {
        const notification = await this.findOne(1);
        return this.notificationRepository.find({
            where: notification, // 一对多 / 多对多
            relations: {
                notificationAttachments: true,
            },
        });
    }

    create(notification: Notification) {
        const newNotification =
            this.notificationRepository.create(notification);
        return this.notificationRepository.save(newNotification);
    }

    update(id: number, notification: Partial<Notification>) {
        return this.notificationRepository.update(id, notification);
    }

    remove(id: number) {
        return this.notificationRepository.delete(id);
    }
}
