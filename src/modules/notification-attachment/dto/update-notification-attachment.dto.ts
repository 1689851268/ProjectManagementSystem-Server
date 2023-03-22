import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationAttachmentDto } from './create-notification-attachment.dto';

export class UpdateNotificationAttachmentDto extends PartialType(
    CreateNotificationAttachmentDto,
) {}
