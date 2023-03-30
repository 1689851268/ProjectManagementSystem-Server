import { Module } from '@nestjs/common';
import { NotificationAttachmentService } from './notification-attachment.service';
import { NotificationAttachmentController } from './notification-attachment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationAttachment } from '@/entities/NotificationAttachment';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationAttachment]),
        MulterModule.register({
            storage: diskStorage({
                // 存储地址
                destination: join(
                    __dirname,
                    '../../../public/notification-attachment',
                ),
                // 存储名称
                filename(_req, file, callback) {
                    const suffix = extname(file.originalname); // 获取文件后缀
                    const docName = new Date().getTime(); // 自定义文件名
                    return callback(null, `${docName}${suffix}`);
                },
            }),
            // 解决中文名乱码的问题
            fileFilter(_req, file, callback) {
                // multer 默认使用 latin1 编码来解析文件名, 而 latin1 编码不支持中文字符, 所以会出现中文名乱码的现象
                // 这里将文件名从 latin1 编码转换为 Buffer 对象, 再用 toString(“utf8”) 是将 Buffer 对象转换为 utf8 编码的字符串
                // utf8 是一种支持多国语言的编码方式, 这样就可以保证文件名的中文字符不会被错误解析
                file.originalname = Buffer.from(
                    file.originalname,
                    'latin1',
                ).toString('utf8');
                callback(null, true);
            },
        }),
    ],
    controllers: [NotificationAttachmentController],
    providers: [NotificationAttachmentService],
})
export class NotificationAttachmentModule {}
