import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/Project';
import { Teacher } from 'src/entities/Teacher';
import { College } from 'src/entities/College';
import { Student } from '@/entities/Student';
import { Specialist } from '@/entities/Specialist';
import { ProjectAttachment } from '@/entities/ProjectAttachment';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Project,
            Teacher,
            College,
            Student,
            Specialist,
            ProjectAttachment,
        ]),
    ],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {}
