import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectAttachment } from 'src/entities/ProjectAttachment';
import { Repository } from 'typeorm';
import { CreateProjectAttachmentDto } from './dto/create-project-attachment.dto';
import { UpdateProjectAttachmentDto } from './dto/update-project-attachment.dto';

@Injectable()
export class ProjectAttachmentService {
    constructor(
        @InjectRepository(ProjectAttachment)
        private readonly projectAttachmentRepository: Repository<ProjectAttachment>,
    ) {}

    create(createProjectAttachmentDto: CreateProjectAttachmentDto) {
        return 'This action adds a new projectAttachment';
    }

    find(id: number) {
        return this.projectAttachmentRepository
            .createQueryBuilder('projectAttachment')
            .select('projectAttachment.name', 'projectAttachmentName')
            .addSelect('COUNT("projectAttachment.id")', 'count')
            .leftJoinAndSelect('projectAttachment.projectId', 'project')
            .where('project.id = :id', { id })
            .groupBy('projectAttachment.name')
            .getRawMany();
    }

    findOne(id: number) {
        return this.projectAttachmentRepository.query(
            `select * from project_attachment where id = ${id}`,
        );
    }

    update(id: number, updateProjectAttachmentDto: UpdateProjectAttachmentDto) {
        return `This action updates a #${id} projectAttachment`;
    }

    remove(id: number) {
        return `This action removes a #${id} projectAttachment`;
    }
}
