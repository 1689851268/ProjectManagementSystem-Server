import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/Project';
import { Teacher } from 'src/entities/Teacher';
import { College } from 'src/entities/College';

@Module({
    imports: [TypeOrmModule.forFeature([Project, Teacher, College])],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {}
