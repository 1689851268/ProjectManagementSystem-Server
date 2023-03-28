import { NotificationAttachment } from '@/entities/NotificationAttachment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationAttachmentDto } from './dto/create-notification-attachment.dto';

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
}
