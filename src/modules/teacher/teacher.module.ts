import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { Teacher } from 'src/entities/Teacher';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Teacher])],
    controllers: [TeacherController],
    providers: [TeacherService],
})
export class TeacherModule {}
