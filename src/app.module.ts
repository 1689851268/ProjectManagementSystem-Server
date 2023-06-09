import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DbConfig } from './enum/dbConfig.enum';

import { College } from './entities/College';
import { Identity } from './entities/Identity';
import { Notification } from './entities/Notification';
import { NotificationAttachment } from './entities/NotificationAttachment';
import { Project } from './entities/Project';
import { ProjectAttachment } from './entities/ProjectAttachment';
import { Root } from './entities/Root';
import { Specialist } from './entities/Specialist';
import { ProjectStatus } from './entities/ProjectStatus';
import { Student } from './entities/Student';
import { Teacher } from './entities/Teacher';
import { ProjectType } from './entities/ProjectType';
import { Major } from './entities/Major';

import { CollegeModule } from './modules/college/college.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProjectAttachmentModule } from './modules/project-attachment/project-attachment.module';
import { ProjectModule } from './modules/project/project.module';
import { RootModule } from './modules/root/root.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { StudentModule } from './modules/student/student.module';
import { SpecialistModule } from './modules/specialist/specialist.module';
import { MetaDataModule } from './modules/meta-data/meta-data.module';
import { NotificationAttachmentModule } from './modules/notification-attachment/notification-attachment.module';
import { UserModule } from './modules/user/user.module';
import { MajorModule } from './modules/major/major.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return {
                    logging: process.env.NODE_ENV === 'development', // 开发环境下打印日志
                    type: configService.get(DbConfig.TYPE),
                    host: configService.get(DbConfig.HOST),
                    port: configService.get(DbConfig.PORT),
                    username: configService.get(DbConfig.USERNAME),
                    password: configService.get(DbConfig.PASSWORD),
                    database: configService.get(DbConfig.DATABASE),
                    retryDelay: configService.get(DbConfig.RETRYDELAY),
                    retryAttempts: configService.get(DbConfig.RETRYATTEMPTS),
                    // synchronize: configService.get(DbConfig.SYNCHRONIZE), // 第一次启动项目后请将其注释掉
                    entities: [
                        College,
                        Identity,
                        Major,
                        Notification,
                        NotificationAttachment,
                        Project,
                        ProjectAttachment,
                        ProjectStatus,
                        ProjectType,
                        Root,
                        Specialist,
                        Student,
                        Teacher,
                    ],
                } as TypeOrmModuleOptions;
            },
        }),
        NotificationModule,
        CollegeModule,
        RootModule,
        ProjectModule,
        ProjectAttachmentModule,
        TeacherModule,
        StudentModule,
        SpecialistModule,
        MetaDataModule,
        NotificationAttachmentModule,
        UserModule,
        MajorModule,
    ],
})
export class AppModule {}
