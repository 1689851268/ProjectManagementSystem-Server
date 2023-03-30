import { College } from '@/entities/College';
import { Project } from '@/entities/Project';
import { Specialist } from '@/entities/Specialist';
import { Student } from '@/entities/Student';
import { Teacher } from '@/entities/Teacher';
import { getIdsByName, getTeacherIdsByCollegeIds } from '@/utils/queryBuilder';
import { Repository, SelectQueryBuilder } from 'typeorm';

/**
 * 处理 projectName 参数
 * @param result queryBuilder 对象
 * @param projectName 项目名
 */
const handleProjectName = (
    result: SelectQueryBuilder<Project>,
    projectName: string,
) => {
    if (!projectName) return;
    result.where('project.name like :keyword', {
        keyword: `%${projectName}%`,
    });
};

/**
 * 处理 projectType 参数
 * @param result queryBuilder 对象
 * @param projectType 项目类型
 */
const handleProjectType = (
    result: SelectQueryBuilder<Project>,
    projectType: number,
) => {
    if (!projectType) return;
    result.andWhere('project.type = :type', { type: projectType });
};

/**
 * 处理 projectStatus 参数
 * @param result queryBuilder 对象
 * @param projectStatus 项目状态
 */
const handleProjectStatus = (
    result: SelectQueryBuilder<Project>,
    projectStatus: number,
) => {
    if (!projectStatus) return;
    result.andWhere('project.status = :status', {
        status: projectStatus,
    });
};

/**
 * 处理 teacher 参数
 * @param teacherRepository teacher 实体的 Repository
 * @param result queryBuilder 对象
 * @param teacher 教师名
 */
const handleTeacher = async (
    teacherRepository: Repository<Teacher>,
    result: SelectQueryBuilder<Project>,
    teacher: string,
) => {
    if (!teacher) return;

    // 先根据 teacher 模糊查询得到 idArr
    const idArr = await getIdsByName(teacherRepository, teacher, 'teacher');
    // 如果 idArr 为空, 则将 idArr 的第一个元素设为 0, 以便后面筛选
    if (idArr.length === 0) {
        idArr.push(0);
    }

    // 然后筛选 project 表, 找到 id 数组对应的项目
    result.andWhere('project.teacher in (:...idArr)', { idArr });
};

/**
 * 处理 college 参数
 * @param collegeRepository college 实体的 Repository
 * @param teacherRepository teacher 实体的 Repository
 * @param result queryBuilder 对象
 * @param college 学院名
 */
const handleCollege = async (
    collegeRepository: Repository<College>,
    teacherRepository: Repository<Teacher>,
    result: SelectQueryBuilder<Project>,
    college: string,
) => {
    if (!college) return;

    // 先根据 college 模糊查询得到 id 数组
    const collegeIdArr = await getIdsByName(
        collegeRepository,
        college,
        'college',
    );
    // 如果 idArr 为空, 则将 idArr 的第一个元素设为 0, 以便后面筛选
    if (collegeIdArr.length === 0) {
        collegeIdArr.push(0);
    }

    // 根据 collegeIdArr 查询 TeacherIdArr
    const teacherIdArr = await getTeacherIdsByCollegeIds(
        teacherRepository,
        collegeIdArr,
    );
    // 如果 idArr 为空, 则将 idArr 的第一个元素设为 0, 以便后面筛选
    if (teacherIdArr.length === 0) {
        teacherIdArr.push(0);
    }

    // 最后筛选 project 表, 找到老师对应的项目
    result.andWhere('project.teacher in (:...teacherIdArr)', {
        teacherIdArr,
    });
};

// 处理查询参数, 将查询参数和处理函数对应起来
export const queryHandler = {
    projectName: handleProjectName,
    projectType: handleProjectType,
    projectStatus: handleProjectStatus,
    teacher: handleTeacher,
    college: handleCollege,
};

/**
 * 格式化项目数据
 * @param data 项目数据
 * @param teacherRepository Teacher 实体的 Repository
 * @returns 格式化后的项目数据
 */
export const formatProjectData = async (
    data: Project[],
    teacherRepository: Repository<Teacher>,
    studentRepository: Repository<Student>,
    specialistRepository: Repository<Specialist>,
) => {
    const newData = [];

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        // 根据 teacherId 查询 college.name 和 teacher.name
        const { teacher_name, college_name } = await teacherRepository
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.college', 'college')
            .select(['college.name', 'teacher.name'])
            .where('teacher.id = :id', { id: item.teacher })
            .getRawOne();

        // 如果项目负责人不为空, 则查询项目负责人的 name
        let projectLeader: number | string = item.projectLeader;
        if (projectLeader) {
            // 使用 QueryBuilder, 根据 projectLeader 查询 student.name
            const student = await studentRepository
                .createQueryBuilder('student')
                .select(['student.name'])
                .where('student.id = :id', { id: item.projectLeader })
                .getOne();
            projectLeader = student.name;
        }

        // 如果项目申请时间不为空, 则格式化项目申请时间
        let applicationDate = item.applicationDate;
        if (applicationDate) {
            applicationDate = new Date(+applicationDate).toLocaleString();
        }

        // 如果专家不为空, 则查询专家的 name
        let specialist: string | number = item.specialist;
        if (specialist) {
            // 使用 QueryBuilder, 根据 specialist 查询 specialist.name
            const temp = await specialistRepository
                .createQueryBuilder('specialist')
                .select(['specialist.name'])
                .where('specialist.id = :id', { id: item.specialist })
                .getOne();
            specialist = temp.name;
        }

        // 将 college 和 teacher 添加到 item 中
        newData.push({
            ...item,
            applicationDate, // 添加项目申请时间
            projectLeader, // 添加项目负责人的 name
            specialist, // 添加专家的 name
            college: college_name, // 添加项目所属学院的 name
            teacher: teacher_name, // 添加项目指导老师的 name
            publishTime: new Date(+item.publishTime).toLocaleString(), // 格式化发布时间
        });
    }

    return newData;
};
