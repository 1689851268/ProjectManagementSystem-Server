import { Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    findAll() {
        return this.notificationService.findAll();
    }

    @Get('publisher')
    findPublisher() {
        return this.notificationService.findPublisher(1);
    }

    @Get('lastUpdater')
    findLastUpdater() {
        return this.notificationService.findLastUpdater(1);
    }

    @Get('attachment')
    findAttachment() {
        return this.notificationService.findAttachment();
    }

    @Post()
    create() {
        return null;
    }
}
