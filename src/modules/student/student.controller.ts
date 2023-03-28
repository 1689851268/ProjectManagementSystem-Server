import { Controller, Post, Body } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post()
    create(@Body() createStudentDto: CreateStudentDto) {
        // 处理 body 的数据格式
        createStudentDto = {
            password: createStudentDto.password,
            name: createStudentDto.name,
            class: +createStudentDto.class,
            major: +createStudentDto.major,
            college: +createStudentDto.college,
            email: createStudentDto.email || '',
            phone: createStudentDto.phone || '',
            identity: 1,
            registrationTime: `${new Date().getTime()}`,
        };
        return this.studentService.create(createStudentDto);
    }
}
