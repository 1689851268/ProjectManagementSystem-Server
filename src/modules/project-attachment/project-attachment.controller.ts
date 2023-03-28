import { Controller, Get, Param } from '@nestjs/common';
import { ProjectAttachmentService } from './project-attachment.service';

@Controller('project-attachment')
export class ProjectAttachmentController {
    constructor(
        private readonly projectAttachmentService: ProjectAttachmentService,
    ) {}

    @Get()
    findAll() {
        return this.projectAttachmentService.find(1);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectAttachmentService.findOne(+id);
    }
}
