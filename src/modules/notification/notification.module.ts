import { NotificationAttachment } from '@/entities/NotificationAttachment';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/Notification';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
    imports: [TypeOrmModule.forFeature([Notification, NotificationAttachment])], // 导入 Notification 实体
    controllers: [NotificationController],
    providers: [NotificationService],
})
export class NotificationModule {}
