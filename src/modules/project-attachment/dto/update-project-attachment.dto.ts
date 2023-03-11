import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectAttachmentDto } from './create-project-attachment.dto';

export class UpdateProjectAttachmentDto extends PartialType(
    CreateProjectAttachmentDto,
) {}
