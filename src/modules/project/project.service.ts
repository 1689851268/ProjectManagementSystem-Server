import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { College } from 'src/entities/College';
import { Project } from 'src/entities/Project';
import { Teacher } from 'src/entities/Teacher';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
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

        const result = this.projectRepository
            .createQueryBuilder('project')
            .select('*');

        // 搜索项目名称
        queryHandler.projectName(result, projectName);

        // 搜索该类型的项目
        queryHandler.projectType(result, projectType);

        // 搜索该状态的项目
        queryHandler.projectStatus(result, projectStatus);

        // 搜索该老师负责的项目; 因为需要查询 teacher 表, 所以需要传入 teacherRepository
        await queryHandler.teacher(this.teacherRepository, result, teacher);

        // 搜索该学院的项目; 因为需要查询 college & teacher 表, 所以需要传入 collegeRepository & teacherRepository
        await queryHandler.college(
            this.collegeRepository,
            this.teacherRepository,
            result,
            college,
        );

        // 倒序排列, 以 id 为准; 分页
        const data = await result
            .orderBy('project.id', 'DESC')
            .offset((curPage - 1) * pageSize)
            .limit(pageSize)
            .getRawMany();

        return {
            data: await formatProjectData(data, this.teacherRepository),
            total: await result.getCount(),
        };
    }

    // 根据 id 删除项目
    async remove(id: number) {
        const res = await this.projectRepository.delete(id);
        return res.affected; // 返回删除的条数
    }
}
