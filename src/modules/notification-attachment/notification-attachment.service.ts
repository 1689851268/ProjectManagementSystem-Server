import { NotificationAttachment } from '@/entities/NotificationAttachment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationAttachmentDto } from './dto/create-notification-attachment.dto';
import { UpdateNotificationAttachmentDto } from './dto/update-notification-attachment.dto';

@Injectable()
export class NotificationAttachmentService {
    constructor(
        @InjectRepository(NotificationAttachment)
        private readonly notificationAttachmentRepository: Repository<NotificationAttachment>,
    ) {}

    create(createNotificationAttachmentDto: CreateNotificationAttachmentDto) {
        const newNotificationAttachment =
            this.notificationAttachmentRepository.create(
                createNotificationAttachmentDto,
            );
        return this.notificationAttachmentRepository.save(
            newNotificationAttachment,
        );
    }

    findAll() {
        return `This action returns all notificationAttachment`;
    }

    findOne(id: number) {
        return `This action returns a #${id} notificationAttachment`;
    }

    update(
        id: number,
        updateNotificationAttachmentDto: UpdateNotificationAttachmentDto,
    ) {
        return `This action updates a #${id} notificationAttachment`;
    }

    remove(id: number) {
        return `This action removes a #${id} notificationAttachment`;
    }
}
