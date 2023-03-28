import { Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Body, Delete, Param, Query } from '@nestjs/common/decorators';
import { NotificationListQuery, NotificationQuery } from './utils/interfaces';
import { ParseIntPipe } from '@nestjs/common/pipes';

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

    @Get('list')
    findList(@Query() query: NotificationListQuery) {
        query = {
            title: query.title,
            curPage: +query.curPage || 1,
            pageSize: +query.pageSize || 5,
            publisher: query.publisher,
            lastUpdater: query.lastUpdater,
        };
        return this.notificationService.findList(query);
    }

    @Get('attachment')
    findAttachment() {
        return this.notificationService.findAttachment();
    }

    @Get(':id')
    getNotificationById(@Param('id', ParseIntPipe) id: number) {
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

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.notificationService.remove(+id);
    }
}
