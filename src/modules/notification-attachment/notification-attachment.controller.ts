import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { NotificationAttachmentService } from './notification-attachment.service';
import { CreateNotificationAttachmentDto } from './dto/create-notification-attachment.dto';
import { UpdateNotificationAttachmentDto } from './dto/update-notification-attachment.dto';

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

    @Get()
    findAll() {
        return this.notificationAttachmentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.notificationAttachmentService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body()
        updateNotificationAttachmentDto: UpdateNotificationAttachmentDto,
    ) {
        return this.notificationAttachmentService.update(
            +id,
            updateNotificationAttachmentDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notificationAttachmentService.remove(+id);
    }
}
