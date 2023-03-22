import { College } from '@/entities/College';
import { Project } from '@/entities/Project';
import { Teacher } from '@/entities/Teacher';
import { getIdsByName, getTeacherIdsByCollegeIds } from '@/utils/queryBuilder';
import { Repository, SelectQueryBuilder } from 'typeorm';

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
    // 先根据 teacher 模糊查询得到 idArr
    const idArr = await getIdsByName(teacherRepository, teacher, 'teacher');
    // 如果 idArr 为空, 则将 idArr 的第一个元素设为 0, 以便后面筛选
    if (idArr.length === 0) {
        idArr.push(0);
    }
    // 然后筛选 project 表, 找到 id 数组对应的项目
    return result.andWhere('project.teacher in (:...idArr)', { idArr });
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
    return result.andWhere('project.teacher in (:...teacherIdArr)', {
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
        // 将 college 和 teacher 添加到 item 中
        newData.push({
            ...item,
            college: college_name, // 添加项目所属学院的 name
            teacher: teacher_name, // 添加项目指导老师的 name
            publishTime: new Date(+item.publishTime).toLocaleString(), // 格式化发布时间
        });
    }

    return newData;
};
