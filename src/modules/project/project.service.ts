import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { College } from 'src/entities/College';
import { Project } from 'src/entities/Project';
import { Teacher } from 'src/entities/Teacher';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryT } from './interface';
import {
    getIdsByName,
    getTeacherIdsByCollegeIds,
} from '../../utils/queryBuilder';

// 处理 projectName 参数
const handleProjectName = (
    result: SelectQueryBuilder<Project>,
    projectName: string,
) => {
    result.where('project.name like :keyword', {
        keyword: `%${projectName}%`,
    });
};

// 处理 projectType 参数
const handleProjectType = (
    result: SelectQueryBuilder<Project>,
    projectType: number,
) => {
    result.andWhere('project.type = :type', { type: projectType });
};

// 处理 projectType 参数
const handleProjectStatus = (
    result: SelectQueryBuilder<Project>,
    projectStatus: number,
) => {
    result.andWhere('project.status = :status', {
        status: projectStatus,
    });
};

// 处理 teacher 参数
const handleTeacher = async (
    teacherRepository: Repository<Teacher>,
    result: SelectQueryBuilder<Project>,
    teacher: string,
) => {
    // 先根据 teacher 模糊查询得到 id 数组
    const idArr = await getIdsByName(teacherRepository, teacher, 'teacher');
    // 然后筛选 project 表, 找到 id 数组对应的项目
    result.andWhere('project.teacher in (:...idArr)', { idArr });
};

// 处理 college 参数
const handleCollege = async (
    collegeRepository: Repository<College>,
    teacherRepository: Repository<Teacher>,
    result: SelectQueryBuilder<Project>,
    college: string,
) => {
    // 先根据 college 模糊查询得到 id 数组
    const collegeIdArr = await getIdsByName(
        collegeRepository,
        college,
        'college',
    );

    // 根据 collegeIdArr 查询 TeacherIdArr
    const teacherIdArr = await getTeacherIdsByCollegeIds(
        teacherRepository,
        collegeIdArr,
    );

    // 最后筛选 project 表, 找到老师对应的项目
    result.andWhere('project.teacher in (:...teacherIdArr)', {
        teacherIdArr,
    });
};

// 处理查询参数, 将查询参数和处理函数对应起来
const queryHandler = {
    projectName: handleProjectName,
    projectType: handleProjectType,
    projectStatus: handleProjectStatus,
    teacher: handleTeacher,
    college: handleCollege,
};

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
            queryHandler.teacher(this.teacherRepository, result, teacher);
        }

        // 搜索该学院的项目
        if (college) {
            queryHandler.college(
                this.collegeRepository,
                this.teacherRepository,
                result,
                college,
            );
        }

        return result
            .offset((curPage - 1) * pageSize)
            .limit(pageSize)
            .getRawMany();
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
