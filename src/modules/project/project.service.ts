import { Specialist } from '@/entities/Specialist';
import { Student } from '@/entities/Student';
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
import { ProjectAttachment } from '@/entities/ProjectAttachment';
import { ApplyProjectDto } from './dto/apply-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(College)
        private readonly collegeRepository: Repository<College>,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(Specialist)
        private readonly specialistRepository: Repository<Specialist>,
        @InjectRepository(ProjectAttachment)
        private readonly projectAttachmentRepository: Repository<ProjectAttachment>,
    ) {}

    // 教师创建项目
    create(createProjectDto: CreateProjectDto) {
        const newProject = this.projectRepository.create(createProjectDto);
        return this.projectRepository.save(newProject);
    }

    // 根据 projectId 更新项目
    update(projectId: number, updateProjectDto: UpdateProjectDto) {
        // 使用 QueryBuilder 更新数据
        return this.projectRepository
            .createQueryBuilder()
            .update(Project)
            .set(updateProjectDto)
            .where('id = :id', { id: projectId })
            .execute();
    }

    // 申请项目
    async apply(applyProjectDto: ApplyProjectDto) {
        // 使用 QueryBuilder 更新数据
        // 1. 根据 projectId 查询项目, 并将项目的 status 设置为 2, projectLeader 设置为 applyUserId, applicationDate 设置为当前时间
        const project = await this.projectRepository
            .createQueryBuilder()
            .update(Project)
            .set({
                status: 2,
                projectLeader: applyProjectDto.applyUserId,
                applicationDate: applyProjectDto.applicationDate,
            })
            .where('id = :id', { id: applyProjectDto.projectId })
            .execute();

        // 2. 为 project_and_student 表插入数据, 项目 id 为 projectId, 学生 id 为 teammateId 里面的所有 id
        const { projectId, teammateId } = applyProjectDto;
        const teammate = [];
        teammateId.forEach(async (id) => {
            // 先查看该学生是否已经申请了项目, 如果已经申请了项目, 则不允许再次申请
            const againApply = await this.projectRepository
                .createQueryBuilder('project')
                .select('project.id')
                .innerJoin(
                    'project_and_student',
                    'pas',
                    'pas.projectId = project.id',
                )
                .where('pas.studentId = :id', { id })
                .getOne();
            if (againApply) {
                return;
            }

            // 如果没有申请过项目, 则允许申请
            const res = await this.projectRepository
                .createQueryBuilder()
                .insert()
                .into('project_and_student')
                .values({ projectId, studentId: id })
                .execute();
            teammate.push(res);
        });

        return { project, teammate };
    }

    // 教师拒绝申请
    async rejectApply(projectId: number) {
        // 根据 projectId 更新 status: 1, applicationDate: "", projectLeader: null
        const project = await this.projectRepository
            .createQueryBuilder()
            .update(Project)
            .set({
                status: 1,
                applicationDate: '',
                projectLeader: null,
            })
            .where('id = :id', { id: projectId })
            .execute();

        // 根据 projectId 删除 project_and_student 表中的数据
        const projectAndStudent = await this.projectRepository
            .createQueryBuilder()
            .delete()
            .from('project_and_student')
            .where('projectId = :projectId', { projectId })
            .execute();

        return { project, projectAndStudent };
    }

    // 学生撤销申请
    async revokeApply(projectId: number) {
        // 使用 QueryBuilder 更新数据, 将项目的 status 设置为 1, projectLeader 设置为 null, applicationDate 设置为 ""
        const project = await this.projectRepository
            .createQueryBuilder()
            .update(Project)
            .set({
                status: 1,
                projectLeader: null,
                applicationDate: '',
            })
            .where('id = :id', { id: projectId })
            .execute();

        // 删除 project_and_student 表中的数据
        const projectAndStudent = this.projectRepository
            .createQueryBuilder()
            .delete()
            .from('project_and_student')
            .where('projectId = :projectId', { projectId })
            .execute();

        return { project, projectAndStudent };
    }

    // 专家拒绝开题 and 专家拒绝结题
    rejectOpen(projectId: number) {
        // 使用 QueryBuilder 更新数据, 将项目的 status 设置为 6, failureTime 设置为当前时间
        return this.projectRepository
            .createQueryBuilder()
            .update(Project)
            .set({
                status: 6,
                failureTime: `${new Date().getTime()}`,
            })
            .where('id = :id', { id: projectId })
            .execute();
    }

    // 专家同意开题
    allowOpen(projectId: number) {
        // 根据 projectId 更新 status: 4, openTime: 当前时间
        return this.projectRepository
            .createQueryBuilder()
            .update(Project)
            .set({
                status: 4,
                openTime: `${new Date().getTime()}`,
            })
            .where('id = :id', { id: projectId })
            .execute();
    }

    // 专家同意结题
    allowClose(projectId: number) {
        // 根据 projectId 更新 status: 5, finishTime: 当前时间
        return this.projectRepository
            .createQueryBuilder()
            .update(Project)
            .set({
                status: 5,
                finishTime: `${new Date().getTime()}`,
            })
            .where('id = :id', { id: projectId })
            .execute();
    }

    // 根据 ProjectLeader 查询项目
    async findByProjectLeader(userId: number, identity: number, query: QueryT) {
        const {
            projectName,
            projectType,
            teacher,
            projectStatus,
            curPage,
            pageSize,
            college,
        } = query;

        // 根据 identity 判断是学生, 老师, 还是专家
        // 如果是学生, 则 userId 为 projectLeader
        // 如果是老师, 则 userId 为 teacherId
        // 如果是专家, 则 userId 为 specialist
        const props = {
            1: 'projectLeader',
            2: 'teacher',
            3: 'specialist',
        };

        // 根据 projectLeader 查询项目
        const result = this.projectRepository
            .createQueryBuilder('project')
            .select('*')
            .where(`project.${props[identity]} = :userId`, {
                userId,
            });

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
            data: await formatProjectData(
                data,
                this.teacherRepository,
                this.studentRepository,
                this.specialistRepository,
            ),
            total: await result.getCount(),
        };
    }

    // 根据 projectId 查询项目的 name, type, description; 用于辅助更新项目信息
    findOne(id: number) {
        // 使用 QueryBuilder 查询数据
        return this.projectRepository
            .createQueryBuilder('project')
            .select('project.name, project.type, project.description')
            .where('project.id = :id', { id })
            .getRawOne();
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
            data: await formatProjectData(
                data,
                this.teacherRepository,
                this.studentRepository,
                this.specialistRepository,
            ),
            total: await result.getCount(),
        };
    }

    // 根据 id 删除项目
    async remove(id: number) {
        const res = await this.projectRepository.delete(id);
        return res.affected; // 返回删除的条数
    }

    // 根据 projectId 更新 project 表
    allowApply(projectId: number, specialist: number) {
        // 使用 QueryBuilder 更新数据
        // 更新 status 为 3, specialist 为 specialist
        return this.projectRepository
            .createQueryBuilder()
            .update(Project)
            .set({
                status: 3,
                specialist,
            })
            .where('id = :id', { id: projectId })
            .execute();
    }

    // 根据 projectId 获取项目的详细信息, 包括项目的信息，项目成员的信息，项目附件的信息
    async findDetail(id: number) {
        const project = await this.projectRepository
            .createQueryBuilder('project')
            .select([
                'project.id',
                'project.name',
                'project.description',
                'project.openTime',
                'project.finishTime',
                'project.publishTime',
                'project.applicationDate',
                'project.failureTime',
                'projectLeader.id',
                'projectLeader.name',
                'teacher.id',
                'teacher.name',
                'specialist.id',
                'specialist.name',
                'status.id',
                'status.name',
                'type.id',
                'type.name',
            ])
            .leftJoinAndSelect('project.projectLeader', 'projectLeader')
            .leftJoinAndSelect('project.teacher', 'teacher')
            .leftJoinAndSelect('project.specialist', 'specialist')
            .leftJoinAndSelect('project.status', 'status')
            .leftJoinAndSelect('project.type', 'type')
            .where('project.id = :id', { id })
            .getOne();

        // 根据 projectId 查询项目成员, 学生与项目的关系表是 project_and_student
        const members = await this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.students', 'student')
            // .select(['student.id', 'student.name'])
            .where('project.id = :id', { id })
            .getMany();

        const attachment = await this.projectAttachmentRepository
            .createQueryBuilder('projectAttachment')
            .select([
                'projectAttachment.id',
                'projectAttachment.name',
                'projectAttachment.storagePath',
                'projectAttachment.type',
            ])
            .where('projectAttachment.projectId = :id', { id })
            .getMany();

        return { project, members, attachment };
    }
}
