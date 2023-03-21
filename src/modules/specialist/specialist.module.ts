import { Module } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { SpecialistController } from './specialist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from 'src/entities/Specialist';

@Module({
    imports: [TypeOrmModule.forFeature([Specialist])],
    controllers: [SpecialistController],
    providers: [SpecialistService],
})
export class SpecialistModule {}
