import { College } from 'src/entities/College';
import { Teacher } from 'src/entities/Teacher';
import { Repository } from 'typeorm';

/**
 * 根据 name 模糊查询获取 idArr
 * @param repository
 * @param name 模糊查询的 name
 * @param repositoryName repository 的别名
 * @returns idArr
 */
export const getIdsByName = async (
    repository: Repository<Teacher | College>,
    name: string,
    repositoryName: string,
) => {
    // 先根据 name 模糊查询 id
    const ids = await repository
        .createQueryBuilder(repositoryName)
        .select(`${repositoryName}.id`)
        .where(`${repositoryName}.name like :name`, { name: `%${name}%` })
        .getRawMany();
    // 处理 ids 的数据结构
    const idArr: number[] = ids.map((item) => {
        return item[`${repositoryName}_id`];
    });
    return idArr;
};

/**
 * 根据 collegeIdArr 获取 TeacherIdArr
 * @param teacherRepository
 * @param collegeIdArr
 * @returns TeacherIdArr
 */
export const getTeacherIdsByCollegeIds = async (
    teacherRepository: Repository<Teacher>,
    collegeIdArr: number[],
) => {
    // 先根据 collegeIdArr 查询 id
    const ids = await teacherRepository
        .createQueryBuilder('teacher')
        .select('teacher.id')
        .where('teacher.college in (:...collegeIdArr)', { collegeIdArr })
        .getRawMany();
    // 处理 ids 的数据结构
    const idArr: number[] = ids.map((item) => {
        return item.teacher_id;
    });
    return idArr;
};
