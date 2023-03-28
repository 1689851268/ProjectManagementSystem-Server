import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectAttachment } from 'src/entities/ProjectAttachment';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectAttachmentService {
    constructor(
        @InjectRepository(ProjectAttachment)
        private readonly projectAttachmentRepository: Repository<ProjectAttachment>,
    ) {}

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
}
