import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/Project';
import { ProjectAttachment } from 'src/entities/ProjectAttachment';

@Module({
    imports: [TypeOrmModule.forFeature([Project, ProjectAttachment])],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {}
