import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/entities/Teacher';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
    ) {}

    create(createTeacherDto: CreateTeacherDto) {
        const newTeacher = this.teacherRepository.create(createTeacherDto);
        return this.teacherRepository.save(newTeacher);
    }

    findAll() {
        return `This action returns all teacher`;
    }

    findOne(id: number) {
        return `This action returns a #${id} teacher`;
    }

    // 根据 name 模糊查询 teacherIds
    getIdsByName(name: string) {
        return this.teacherRepository
            .createQueryBuilder('teacher')
            .select('teacher.id')
            .where('teacher.name like :name', { name: `%${name}%` })
            .getRawMany();
    }

    // 根据 collegeIds 查询 teacherIds
    getIdsByCollegeIds(collegeIds: number[]) {
        return this.teacherRepository
            .createQueryBuilder('teacher')
            .select('teacher.id')
            .where('teacher.college in (:...collegeIds)', { collegeIds })
            .getRawMany();
    }

    update(id: number, updateTeacherDto: UpdateTeacherDto) {
        return `This action updates a #${id} teacher`;
    }

    remove(id: number) {
        return `This action removes a #${id} teacher`;
    }
}
