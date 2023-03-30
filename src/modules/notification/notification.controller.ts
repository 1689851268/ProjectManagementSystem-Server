import { Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
    Body,
    Delete,
    Param,
    Patch,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common/decorators';
import { NotificationListQuery, NotificationQuery } from './utils/interfaces';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('notification')
@UseGuards(AuthGuard('jwt')) // 使用 JWT 鉴权校验用户信息
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

    // 根据 id 获取通知详情, 包括 title, content, attachment
    @Get('detail/:id')
    getNotificationDetailById(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.getNotificationDetailById(id);
    }

    @Get(':id')
    getNotificationById(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.getNotificationById(id);
    }

    @Post()
    create(
        @Req() request: Request,
        @Body() createNotificationDto: CreateNotificationDto,
    ) {
        const user: any = request.user;
        createNotificationDto = {
            title: createNotificationDto.title,
            content: createNotificationDto.content,
            publisher: user.id,
            lastUpdater: user.id,
            publishTime: `${new Date().getTime()}`,
            lastUpdateTime: `${new Date().getTime()}`,
            attachment: createNotificationDto.attachment,
        };
        return this.notificationService.create(createNotificationDto);
    }

    // 根据 notificationId 更新通知, 包括 title, content, attachment
    @Patch(':id')
    update(
        @Req() request: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() createNotificationDto: CreateNotificationDto,
    ) {
        const user: any = request.user;
        createNotificationDto = {
            title: createNotificationDto.title,
            content: createNotificationDto.content,
            lastUpdater: user.id,
            lastUpdateTime: `${new Date().getTime()}`,
            attachment: createNotificationDto.attachment,
        };
        return this.notificationService.update(id, createNotificationDto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.notificationService.remove(+id);
    }
}
