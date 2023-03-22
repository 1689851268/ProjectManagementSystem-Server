import { Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Body, Param, Query } from '@nestjs/common/decorators';
import { NotificationQuery } from './utils/interfaces';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    find(@Query() query: NotificationQuery) {
        query = {
            title: query.title,
            curPage: +query.curPage || 1,
            pageSize: +query.pageSize || 5,
        };
        return this.notificationService.find(query);
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

    @Get(':id')
    getNotificationById(@Param('id') id: number) {
        id = +id;
        return this.notificationService.getNotificationById(id);
    }

    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto) {
        createNotificationDto = {
            title: createNotificationDto.title,
            content: createNotificationDto.content,
            publisher: +createNotificationDto.publisher,
            lastUpdater: +createNotificationDto.publisher,
            isOnTop: +createNotificationDto.isOnTop,
            publishTime: `${new Date().getTime()}`,
            lastUpdateTime: `${new Date().getTime()}`,
        };
        return this.notificationService.create(createNotificationDto);
    }
}
