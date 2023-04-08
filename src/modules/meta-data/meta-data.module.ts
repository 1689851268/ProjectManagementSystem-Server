import { Module } from '@nestjs/common';
import { MetaDataService } from './meta-data.service';
import { MetaDataController } from './meta-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { College } from '@/entities/College';
import { Identity } from '@/entities/Identity';
import { Major } from '@/entities/Major';
import { ProjectStatus } from '@/entities/ProjectStatus';
import { ProjectType } from '@/entities/ProjectType';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            College,
            Identity,
            Major,
            ProjectStatus,
            ProjectType,
        ]),
    ],
    controllers: [MetaDataController],
    providers: [MetaDataService],
})
export class MetaDataModule {}
