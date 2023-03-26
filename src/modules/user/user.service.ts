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

    repository = {
        1: this.studentRepository,
        2: this.teacherRepository,
        3: this.specialistRepository,
    };

    create(createUserDto: CreateUserDto) {
        // 根据用户身份创建用户
        const newUser =
            this.repository[createUserDto.identity].create(createUserDto);
        return this.repository[createUserDto.identity].save(newUser);
    }

    // 根据用户身份查询用户列表
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

    // 根据用户身份、uuid 查询用户
    findOne(uuid: string, identity: number) {
        console.log({ uuid, identity });

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

    update(uuid: string, updateUserDto: UpdateUserDto) {
        // 使用 queryBuilder 更新用户, 根据 uuid 获取用户
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

    // 根据用户身份、uuid 删除用户
    remove(removeBody: RemoveBody) {
        const { uuid, identity } = removeBody;
        return this.repository[identity].delete({ uuid });
    }
}
