import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { College } from './entities/College';
import { Group } from './entities/Group';
import { Identity } from './entities/Identity';
import { Notification } from './entities/Notification';
import { NotificationAttachment } from './entities/NotificationAttachment';
import { Project } from './entities/Project';
import { ProjectAttachment } from './entities/ProjectAttachment';
import { Root } from './entities/Root';
import { Specialist } from './entities/Specialist';
import { Status } from './entities/Status';
import { Student } from './entities/Student';
import { Teacher } from './entities/Teacher';
import { Type } from './entities/Type';
import { DbConfig } from './enum/dbConfig.enum';
import { NotificationModule } from './notification/notification.module';

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
                    type: configService.get(DbConfig.TYPE),
                    host: configService.get(DbConfig.HOST),
                    port: configService.get(DbConfig.PORT),
                    username: configService.get(DbConfig.USERNAME),
                    password: configService.get(DbConfig.PASSWORD),
                    database: configService.get(DbConfig.DATABASE),
                    retryDelay: configService.get(DbConfig.RETRYDELAY),
                    retryAttempts: configService.get(DbConfig.RETRYATTEMPTS),
                    synchronize: configService.get(DbConfig.SYNCHRONIZE),
                    entities: [
                        Type,
                        Status,
                        College,
                        Identity,
                        Group,
                        Notification,
                        NotificationAttachment,
                        Project,
                        ProjectAttachment,
                        Root,
                        Specialist,
                        Student,
                        Teacher,
                    ],
                } as TypeOrmModuleOptions;
            },
        }),
        NotificationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
