import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '@/entities/Student';
import { Teacher } from '@/entities/Teacher';
import { Specialist } from '@/entities/Specialist';

@Module({
    imports: [TypeOrmModule.forFeature([Student, Teacher, Specialist])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
