import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryT } from './utils/interface';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    create(@Body() createProjectDto: CreateProjectDto) {
        createProjectDto = {
            name: createProjectDto.name,
            publishTime: `${new Date().getTime()}`,
            applicationDate: '',
            projectLeader: null,
            type: createProjectDto.type,
            teacher: createProjectDto.teacher,
            specialist: null,
            status: 1,
        };
        return this.projectService.create(createProjectDto);
    }

    @Get()
    findAll(@Query() query: QueryT) {
        query = {
            projectName: query.projectName,
            projectType: +query.projectType,
            teacher: query.teacher,
            projectStatus: +query.projectStatus,
            curPage: +query.curPage,
            pageSize: +query.pageSize,
            college: query.college,
        };
        return this.projectService.find(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
    ) {
        return this.projectService.update(+id, updateProjectDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectService.remove(+id);
    }
}
