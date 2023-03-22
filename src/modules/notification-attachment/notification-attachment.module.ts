import { Module } from '@nestjs/common';
import { NotificationAttachmentService } from './notification-attachment.service';
import { NotificationAttachmentController } from './notification-attachment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationAttachment } from '@/entities/NotificationAttachment';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationAttachment])],
    controllers: [NotificationAttachmentController],
    providers: [NotificationAttachmentService],
})
export class NotificationAttachmentModule {}
