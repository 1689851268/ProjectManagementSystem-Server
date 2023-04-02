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
    Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryT } from './utils/interface';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectPipe } from './pipes/create-project.pipe';
import { ApplyProjectDto } from './dto/apply-project.dto';
import { ApplyProjectPipe } from './pipes/apply-project.pipe';

@Controller('project')
@UseGuards(AuthGuard('jwt')) // 使用 JWT 鉴权校验用户信息
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    // 教师创建项目
    @Post()
    create(@Body(CreateProjectPipe) createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto);
    }

    // 教师根据 projectId 更新项目
    @Patch(':projectId')
    update(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Body() updateProjectDto: UpdateProjectDto,
    ) {
        return this.projectService.update(projectId, updateProjectDto);
    }

    // 教师根据 projectId 删除项目
    @Delete(':projectId')
    remove(@Param('projectId', ParseIntPipe) projectId: number) {
        return this.projectService.remove(projectId);
    }

    // 学生申请项目
    @Post('apply')
    apply(@Body(ApplyProjectPipe) applyProjectDto: ApplyProjectDto) {
        return this.projectService.apply(applyProjectDto);
    }

    // 学生撤销申请
    @Post('revoke')
    revokeApply(@Body('projectId', ParseIntPipe) projectId: number) {
        return this.projectService.revokeApply(projectId);
    }

    // 教师拒绝申请
    @Post('reject')
    rejectApply(@Body('projectId', ParseIntPipe) projectId: number) {
        return this.projectService.rejectApply(projectId);
    }

    // 教师同意申请
    @Patch('allow')
    allowApply(
        @Body('projectId') projectId: number,
        @Body('specialist') specialist: number,
    ) {
        return this.projectService.allowApply(projectId, specialist);
    }

    // 专家拒绝开题 or 专家拒绝结题
    @Patch('rejectOpen')
    rejectOpen(@Body('projectId') projectId: number) {
        return this.projectService.rejectOpen(projectId);
    }

    // 专家同意开题
    @Patch('allowOpen')
    allowOpen(@Body('projectId') projectId: number) {
        return this.projectService.allowOpen(projectId);
    }

    // 专家同意结题
    @Patch('allowClose')
    allowClose(@Body('projectId') projectId: number) {
        return this.projectService.allowClose(projectId);
    }

    // 获取所有的项目
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

    // 根据 projectId 查询项目的 name, type, description; 用于辅助更新项目信息
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.findOne(id);
    }

    // 根据 projectId 查询项目的详细信息
    @Get('detail/:id')
    findDetail(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.findDetail(id);
    }

    // 根据项目负责人 id 查询项目
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
}
