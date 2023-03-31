import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ProjectAttachmentService } from './project-attachment.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProjectAttachmentDto } from './dto/create-project-attachment.dto';
import { Response } from 'express';
import { UpdateProjectAttachmentDto } from './dto/update-project-attachment.dto';

@Controller('project-attachment')
export class ProjectAttachmentController {
    constructor(
        private readonly projectAttachmentService: ProjectAttachmentService,
    ) {}

    // 上传附件文件
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log({
            filename: file.filename,
            originalname: file.originalname,
        });

        return { filename: file.filename, originalname: file.originalname };
    }

    // 创建附件, 更新 notification_attachments 表
    @Post()
    create(
        @Body()
        createProjectAttachmentDto: CreateProjectAttachmentDto,
    ) {
        createProjectAttachmentDto = {
            name: createProjectAttachmentDto.name,
            storagePath: createProjectAttachmentDto.storagePath,
            projectId: +createProjectAttachmentDto.projectId,
            type: +createProjectAttachmentDto.type,
        };
        return this.projectAttachmentService.create(createProjectAttachmentDto);
    }

    // 根据 project id 和 type 获取项目附件列表;  若无, 则返回空
    @Get(':id')
    findAll(
        @Param('id', ParseIntPipe) id: number,
        @Query('type', ParseIntPipe) type: number,
    ) {
        return this.projectAttachmentService.find(id, type);
    }

    // 根据附件 id 下载指定附件
    @Get('download/:id')
    getFile(
        @Res() res: Response, // 如果不使用 res, 而使用 @Res() res: Response, 会无法响应数据
        @Param('id', ParseIntPipe) id: number,
    ) {
        this.projectAttachmentService.getAttachment(res, id);
    }

    // 根据 id 更新附件
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProjectAttachmentDto: UpdateProjectAttachmentDto,
    ) {
        return this.projectAttachmentService.update(
            id,
            updateProjectAttachmentDto,
        );
    }
}
