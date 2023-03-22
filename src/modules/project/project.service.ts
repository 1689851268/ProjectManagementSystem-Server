import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { College } from 'src/entities/College';
import { Project } from 'src/entities/Project';
import { Teacher } from 'src/entities/Teacher';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryT } from './utils/interface';
import { formatProjectData, queryHandler } from './utils/serviceHandler';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(College)
        private readonly collegeRepository: Repository<College>,
    ) {}

    create(createProjectDto: CreateProjectDto) {
        const newProject = this.projectRepository.create(createProjectDto);
        return this.projectRepository.save(newProject);
    }

    // 根据条件查询项目
    async find(query: QueryT) {
        const {
            projectName,
            projectType,
            teacher,
            projectStatus,
            curPage,
            pageSize,
            college,
        } = query;

        let result = this.projectRepository
            .createQueryBuilder('project')
            .select('*');

        // 搜索项目名称
        if (projectName) {
            queryHandler.projectName(result, projectName);
        }

        // 搜索该类型的项目
        if (projectType) {
            queryHandler.projectType(result, projectType);
        }

        // 搜索该状态的项目
        if (projectStatus) {
            queryHandler.projectStatus(result, projectStatus);
        }

        // 搜索该老师负责的项目
        if (teacher) {
            result = await queryHandler.teacher(
                this.teacherRepository,
                result,
                teacher,
            );
        }

        // 搜索该学院的项目
        if (college) {
            result = await queryHandler.college(
                this.collegeRepository,
                this.teacherRepository,
                result,
                college,
            );
        }

        const data = await result
            .offset((curPage - 1) * pageSize)
            .limit(pageSize)
            .getRawMany();

        return {
            data: await formatProjectData(data, this.teacherRepository),
            total: await result.getCount(),
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} project`;
    }

    update(id: number, updateProjectDto: UpdateProjectDto) {
        return `This action updates a #${id} project`;
    }

    remove(id: number) {
        return `This action removes a #${id} project`;
    }
}
