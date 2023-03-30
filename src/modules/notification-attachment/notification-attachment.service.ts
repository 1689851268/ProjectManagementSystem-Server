import { NotificationAttachment } from '@/entities/NotificationAttachment';
import { UploadFiles } from '@/enum/filesAddress.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Repository } from 'typeorm';
import { CreateNotificationAttachmentDto } from './dto/create-notification-attachment.dto';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class NotificationAttachmentService {
    constructor(
        @InjectRepository(NotificationAttachment)
        private readonly notificationAttachmentRepository: Repository<NotificationAttachment>,
    ) {}

    create(createNotificationAttachmentDto: CreateNotificationAttachmentDto) {
        const newNotificationAttachment =
            this.notificationAttachmentRepository.create(
                createNotificationAttachmentDto,
            );
        return this.notificationAttachmentRepository.save(
            newNotificationAttachment,
        );
    }

    // 将附件存储到数据库
    storeAttachment(
        notificationId: number,
        filename: string,
        originalname: string,
    ) {
        // 使用 QueryBuilder 完成附件的添加
        return this.notificationAttachmentRepository
            .createQueryBuilder()
            .insert()
            .into(NotificationAttachment)
            .values({
                name: originalname,
                storagePath: filename,
                notificationId,
            })
            .execute();
    }

    // 根据附件 id 下载指定附件
    async getAttachment(res: Response, id: number) {
        // 使用 QueryBuilder, 根据 id 获取附件的 name 和 storagePath
        const notification = await this.notificationAttachmentRepository
            .createQueryBuilder('notificationAttachment')
            .select([
                'notificationAttachment.name',
                'notificationAttachment.storagePath',
            ])
            .where('notificationAttachment.id = :id', { id })
            .getOne();

        if (notification) {
            const url = join(
                UploadFiles.NOTIFICATION_ATTACHMENT,
                notification.storagePath,
            );
            res.download(url, notification.name);
        } else {
            res.status(404).send({
                message: 'File Not Found',
            });
        }
    }

    // 根据 notificationId 获取所有附件
    findAll(notificationId: number) {
        // 使用 QueryBuilder, 根据 notificationId 获取附件的 name 和 storagePath, 结果可能有多个
        return this.notificationAttachmentRepository
            .createQueryBuilder('notificationAttachment')
            .select([
                'notificationAttachment.name',
                'notificationAttachment.storagePath',
                'notificationAttachment.id',
            ])
            .where('notificationAttachment.notificationId = :notificationId', {
                notificationId,
            })
            .getMany();
    }

    // 根据文件名删除附件文件
    deleteAttachment(filename: string) {
        // 使用 Node 的 fs 模块删除文件
        const url = join(UploadFiles.NOTIFICATION_ATTACHMENT, filename);
        fs.unlink(url, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('文件删除成功');
            }
        });
    }
}
