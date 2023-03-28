import { Controller, Post, Body } from '@nestjs/common';
import { NotificationAttachmentService } from './notification-attachment.service';
import { CreateNotificationAttachmentDto } from './dto/create-notification-attachment.dto';

@Controller('notification-attachment')
export class NotificationAttachmentController {
    constructor(
        private readonly notificationAttachmentService: NotificationAttachmentService,
    ) {}

    @Post()
    create(
        @Body()
        createNotificationAttachmentDto: CreateNotificationAttachmentDto,
    ) {
        createNotificationAttachmentDto = {
            name: createNotificationAttachmentDto.name,
            storagePath: createNotificationAttachmentDto.storagePath,
            notificationId: +createNotificationAttachmentDto.notificationId,
        };
        return this.notificationAttachmentService.create(
            createNotificationAttachmentDto,
        );
    }
}
