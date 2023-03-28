import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Controller('teacher')
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Post()
    create(@Body() createTeacherDto: CreateTeacherDto) {
        createTeacherDto = {
            password: createTeacherDto.password,
            name: createTeacherDto.name,
            email: createTeacherDto.email || '',
            phone: createTeacherDto.phone || '',
            college: +createTeacherDto.college,
            identity: 2,
            registrationTime: `${new Date().getTime()}`,
        };
        return this.teacherService.create(createTeacherDto);
    }

    @Get('id')
    getIdsByNameOrCollegeIds(
        @Query('name') name: string,
        @Query('college') collegeIds: string,
    ) {
        if (collegeIds) {
            const stringIdArr = collegeIds.split(','); // '1,2,3' => ['1', '2', '3']
            const numberIdArr: number[] = stringIdArr.map((item) => +item); // ['1', '2', '3'] => [1, 2, 3]
            return this.teacherService.getIdsByCollegeIds(numberIdArr);
        }
        return this.teacherService.getIdsByName(name);
    }
}
