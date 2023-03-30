import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    Get,
    Res,
    Query,
    ParseIntPipe,
    UploadedFile,
    Delete,
    Param,
} from '@nestjs/common';
import { NotificationAttachmentService } from './notification-attachment.service';
import { CreateNotificationAttachmentDto } from './dto/create-notification-attachment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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

    // 根据 notificationId 获取所有附件
    @Get()
    findAll(@Query('notificationId', ParseIntPipe) notificationId: number) {
        return this.notificationAttachmentService.findAll(notificationId);
    }

    // 根据附件 id 下载指定附件
    @Get('download/:id')
    getFile(
        @Res() res: Response, // 如果不使用 res, 而使用 @Res() res: Response, 会无法响应数据
        @Param('id', ParseIntPipe) id: number,
    ) {
        this.notificationAttachmentService.getAttachment(res, id);
    }

    // 上传附件文件
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return { filename: file.filename, originalname: file.originalname };
    }

    // 根据文件名删除附件文件
    @Delete(':filename')
    deleteAttachment(@Param('filename') filename: string) {
        return this.notificationAttachmentService.deleteAttachment(filename);
    }
}
