import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectAttachment } from 'src/entities/ProjectAttachment';
import { Repository } from 'typeorm';
import { CreateProjectAttachmentDto } from './dto/create-project-attachment.dto';
import { Response } from 'express';
import { join } from 'path';
import { UploadFiles } from '@/enum/filesAddress.enum';
import { UpdateProjectAttachmentDto } from './dto/update-project-attachment.dto';

@Injectable()
export class ProjectAttachmentService {
    constructor(
        @InjectRepository(ProjectAttachment)
        private readonly projectAttachmentRepository: Repository<ProjectAttachment>,
    ) {}

    // 根据 project id 和 type 获取项目附件列表
    find(id: number, type: number) {
        // 使用 QueryBuilder, keyword 为模糊查询关键字, 用于搜索附件名称
        return this.projectAttachmentRepository
            .createQueryBuilder('project_attachment')
            .select([
                'project_attachment.id',
                'project_attachment.name',
                'project_attachment.storagePath',
            ])
            .where('project_attachment.projectId = :id', { id })
            .andWhere('project_attachment.type = :type', { type })
            .getOne();
    }

    // 创建附件, 更新 project_attachments 表
    async create(createProjectAttachmentDto: CreateProjectAttachmentDto) {
        const newProAtt = this.projectAttachmentRepository.create(
            createProjectAttachmentDto,
        );
        return this.projectAttachmentRepository.save(newProAtt);
    }

    // 根据附件 id 获取附件信息
    findOne(id: number) {
        return this.projectAttachmentRepository
            .createQueryBuilder('project_attachment')
            .select([
                'project_attachment.name',
                'project_attachment.storagePath',
            ])
            .where('project_attachment.id = :id', { id })
            .getOne();
    }

    // 根据附件 id 下载附件
    async getAttachment(res: Response, id: number) {
        // 使用 QueryBuilder, 根据 id 获取附件的 name 和 storagePath
        const attachment = await this.findOne(id);

        if (attachment) {
            const url = join(
                UploadFiles.PROJECT_ATTACHMENT,
                attachment.storagePath,
            );
            res.download(url, attachment.name);
        } else {
            res.status(404).send({
                message: 'File Not Found',
            });
        }
    }

    // 根据  id 更新附件
    update(id: number, updateProjectAttachmentDto: UpdateProjectAttachmentDto) {
        // 使用 QueryBuilder, 根据 id 更新附件的 name 和 storagePath
        return this.projectAttachmentRepository
            .createQueryBuilder('project_attachment')
            .update(ProjectAttachment)
            .set(updateProjectAttachmentDto)
            .where('id = :id', { id })
            .execute();
    }
}
