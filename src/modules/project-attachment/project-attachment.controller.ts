import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ProjectAttachmentService } from './project-attachment.service';
import { CreateProjectAttachmentDto } from './dto/create-project-attachment.dto';
import { UpdateProjectAttachmentDto } from './dto/update-project-attachment.dto';

@Controller('project-attachment')
export class ProjectAttachmentController {
    constructor(
        private readonly projectAttachmentService: ProjectAttachmentService,
    ) {}

    @Post()
    create(@Body() createProjectAttachmentDto: CreateProjectAttachmentDto) {
        return this.projectAttachmentService.create(createProjectAttachmentDto);
    }

    @Get()
    findAll() {
        return this.projectAttachmentService.find(1);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectAttachmentService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProjectAttachmentDto: UpdateProjectAttachmentDto,
    ) {
        return this.projectAttachmentService.update(
            +id,
            updateProjectAttachmentDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectAttachmentService.remove(+id);
    }
}
