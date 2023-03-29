import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApplyProjectDto, CreateProjectDto } from './dto/create-project.dto';
import { QueryT } from './utils/interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('project')
@UseGuards(AuthGuard('jwt')) // 使用 JWT 鉴权校验用户信息
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
            description: createProjectDto.description,
        };
        return this.projectService.create(createProjectDto);
    }

    @Post('apply')
    apply(@Body() applyProjectDto: ApplyProjectDto) {
        applyProjectDto = {
            ...applyProjectDto,
            applicationDate: `${new Date().getTime()}`,
        };
        return this.projectService.apply(applyProjectDto);
    }

    // 撤销申请
    @Post('revoke')
    revokeApply(@Body('projectId', ParseIntPipe) projectId: number) {
        return this.projectService.revokeApply(projectId);
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

    @Get(':userId/:identity')
    findByProjectLeader(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('identity', ParseIntPipe) identity: number,
        @Query() query: QueryT,
    ) {
        query = {
            projectName: query.projectName,
            projectType: +query.projectType,
            teacher: query.teacher,
            projectStatus: +query.projectStatus,
            curPage: +query.curPage,
            pageSize: +query.pageSize,
            college: query.college,
        };
        return this.projectService.findByProjectLeader(userId, identity, query);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectService.remove(+id);
    }
}
