import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/Project';
import { ProjectAttachment } from 'src/entities/ProjectAttachment';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    create(createProjectDto: CreateProjectDto) {
        return 'This action adds a new project';
    }

    find() {
        return this.projectRepository
            .createQueryBuilder('project')
            .select('project.name', 'name')
            .addSelect('COUNT("projectAttachment.id")', 'count')
            .groupBy('project.name')
            .orderBy('name', 'DESC')
            .addOrderBy('count', 'DESC')
            .offset(2)
            .limit(3)
            .getRawMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} project`;
    }

    update(id: number, updateProjectDto: UpdateProjectDto) {
        return `This action updates a #${id} project`;
    }

    remove(id: number) {
        return `This action removes a #${id} project`;
    }
}
