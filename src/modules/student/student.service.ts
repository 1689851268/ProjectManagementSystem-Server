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
}
