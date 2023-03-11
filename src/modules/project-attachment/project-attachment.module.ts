import { Module } from '@nestjs/common';
import { ProjectAttachmentService } from './project-attachment.service';
import { ProjectAttachmentController } from './project-attachment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectAttachment } from 'src/entities/ProjectAttachment';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectAttachment])],
    controllers: [ProjectAttachmentController],
    providers: [ProjectAttachmentService],
})
export class ProjectAttachmentModule {}
