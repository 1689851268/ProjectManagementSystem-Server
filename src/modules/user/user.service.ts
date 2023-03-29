import { Specialist } from '@/entities/Specialist';
import { Student } from '@/entities/Student';
import { Teacher } from '@/entities/Teacher';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveBody, UserQuery } from './utils/interfaces';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(Specialist)
        private readonly specialistRepository: Repository<Specialist>,
    ) {}

    // 建立 identity 与 repository 的映射
    repository = {
        1: this.studentRepository,
        2: this.teacherRepository,
        3: this.specialistRepository,
    };

    // 根据 identity 创建用户
    create(createUserDto: CreateUserDto) {
        const newUser =
            this.repository[createUserDto.identity].create(createUserDto);
        return this.repository[createUserDto.identity].save(newUser);
    }

    // 根据 identity 获取用户列表; 支持分页; 支持 name, uuid 模糊查询; 按 registrationTime 降序排列
    findAll(userQuery: UserQuery) {
        const { curPage, pageSize, name, identity, uuid } = userQuery;
        return this.repository[identity]
            .createQueryBuilder('user')
            .select(['user.uuid', 'user.name', 'user.registrationTime'])
            .where('user.name like :name', { name: `%${name}%` })
            .andWhere('user.uuid like :uuid', { uuid: `%${uuid}%` })
            .orderBy('user.registrationTime', 'DESC') // 按 registrationTime 降序排列
            .skip((curPage - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
    }

    // 根据 identity, uuid 获取用户信息, 用于用户信息修改
    findOne(uuid: string, identity: number) {
        const queryBuilder =
            this.repository[identity].createQueryBuilder('user');

        // 根据用户身份查询用户
        switch (identity) {
            case 3:
                queryBuilder.select([
                    'user.name',
                    'user.password',
                    'user.email',
                    'user.phone',
                    'user.uuid',
                ]);
                break;
            case 2:
                queryBuilder
                    .leftJoinAndSelect('user.college', 'college')
                    .select([
                        'user.name',
                        'user.password',
                        'user.college',
                        'user.email',
                        'user.phone',
                        'college.id',
                        'college.name',
                        'user.uuid',
                    ]);
                break;
            case 1:
                queryBuilder
                    .leftJoinAndSelect('user.college', 'college')
                    .leftJoinAndSelect('user.major', 'major')
                    .select([
                        'user.name',
                        'user.password',
                        'user.college',
                        'user.major',
                        'user.class',
                        'user.email',
                        'user.phone',
                        'college.id',
                        'college.name',
                        'major.id',
                        'major.name',
                        'user.uuid',
                    ]);
                break;
            default:
                break;
        }

        return queryBuilder.where('user.uuid = :uuid', { uuid }).getOne();
    }

    // 根据 uuid 更新用户信息
    update(uuid: string, updateUserDto: UpdateUserDto) {
        // 根据 identity 获取 queryBuilder
        const queryBuilder =
            this.repository[updateUserDto.identity].createQueryBuilder('user');

        // 根据用户身份更新用户
        switch (updateUserDto.identity) {
            case 3:
                return queryBuilder
                    .update({
                        name: updateUserDto.name,
                        password: updateUserDto.password,
                        email: updateUserDto.email,
                        phone: updateUserDto.phone,
                    })
                    .where('specialist.uuid = :uuid', { uuid })
                    .execute();
            case 2:
                return queryBuilder
                    .update({
                        name: updateUserDto.name,
                        password: updateUserDto.password,
                        email: updateUserDto.email,
                        phone: updateUserDto.phone,
                        college: updateUserDto.college,
                    })
                    .where('teacher.uuid = :uuid', { uuid })
                    .execute();
            case 1:
                return queryBuilder
                    .update({
                        name: updateUserDto.name,
                        password: updateUserDto.password,
                        email: updateUserDto.email,
                        phone: updateUserDto.phone,
                        college: updateUserDto.college,
                        major: updateUserDto.major,
                        class: updateUserDto.class,
                    })
                    .where('student.uuid = :uuid', { uuid })
                    .execute();
        }
    }

    // 根据 identity, uuid 删除用户
    remove(removeBody: RemoveBody) {
        const { uuid, identity } = removeBody;
        return this.repository[identity].delete({ uuid });
    }

    // 根据 identity, uuid 获取用户信息, 用于用户信息展示
    getProfile(uuid: string, identity: number) {
        // 根据 identity 获取 queryBuilder
        const queryBuilder =
            this.repository[identity].createQueryBuilder('user');

        // 每个 identity 都需要查询的字段
        let selectArr = [
            'user.uuid',
            'user.name',
            'user.registrationTime',
            'user.email',
            'user.phone',
        ];

        // 根据 identity 进行联表, 并获取额外需要查询的字段
        switch (identity) {
            case 2:
                queryBuilder.leftJoinAndSelect('user.college', 'college');
                selectArr = [...selectArr, 'college.id', 'college.name'];
                break;
            case 1:
                queryBuilder
                    .leftJoinAndSelect('user.college', 'college')
                    .leftJoinAndSelect('user.major', 'major');
                selectArr = [
                    ...selectArr,
                    'college.id',
                    'college.name',
                    'major.id',
                    'major.name',
                    'user.class',
                ];
                break;
        }

        return queryBuilder
            .select(selectArr)
            .where('user.uuid = :uuid', { uuid })
            .getOne();
    }

    // 根据 uuid 获取用户信息, 用于登录
    async getProfileByUuid(uuid: string) {
        // 遍历 repository, 从每个表中查询用户信息
        for (const key in this.repository) {
            // 跳过原型链上的属性
            if (!Object.prototype.hasOwnProperty.call(this.repository, key))
                break;

            // 根据 uuid 获取用户的 uuid, password, identity 字段, 需要联合 identity 表查询
            const repository = this.repository[key];
            const result = await repository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.identity', 'identity')
                .select([
                    'user.uuid',
                    'user.password',
                    'user.id',
                    'user.name',
                    'identity.id',
                ])
                .where('user.uuid = :uuid', { uuid })
                .getOne();

            // 如果查询到用户信息, 则返回用户信息
            if (result) {
                return {
                    name: result.name as string,
                    uuid: result.uuid as string,
                    id: result.id as number,
                    password: result.password as string,
                    identity: result.identity.id as number,
                };
            }
        }
    }
}
