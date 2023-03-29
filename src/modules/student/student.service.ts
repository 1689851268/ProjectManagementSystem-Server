import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/entities/Student';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) {}

    create(createStudentDto: CreateStudentDto) {
        const newStudent = this.studentRepository.create(createStudentDto);
        return this.studentRepository.save(newStudent);
    }

    findAll(keyword: string) {
        if (!keyword) return;

        // 使用 queryBuilder 查询, keyword 为模糊查询
        // keyword 可能为 uuid, name
        return this.studentRepository
            .createQueryBuilder('student')
            .select(['student.uuid', 'student.name', 'student.id'])
            .where('student.uuid like :keyword', { keyword: `%${keyword}%` })
            .orWhere('student.name like :keyword', { keyword: `%${keyword}%` })
            .getMany();
    }
}
