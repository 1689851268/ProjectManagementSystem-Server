import { AchievementType } from '@/entities/AchievementType';
import { College } from '@/entities/College';
import { Identity } from '@/entities/Identity';
import { Major } from '@/entities/Major';
import { ProjectStatus } from '@/entities/ProjectStatus';
import { ProjectType } from '@/entities/ProjectType';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateMetaDatumDto } from './dto/create-meta-datum.dto';
import { UpdateMetaDatumDto } from './dto/update-meta-datum.dto';

@Injectable()
export class MetaDataService {
    constructor(
        @InjectRepository(AchievementType)
        private readonly achievementTypeRepository: Repository<AchievementType>,
        @InjectRepository(College)
        private readonly collegeRepository: Repository<College>,
        @InjectRepository(Identity)
        private readonly identityRepository: Repository<Identity>,
        @InjectRepository(Major)
        private readonly majorRepository: Repository<Major>,
        @InjectRepository(ProjectStatus)
        private readonly projectStatusRepository: Repository<ProjectStatus>,
        @InjectRepository(ProjectType)
        private readonly projectTypeRepository: Repository<ProjectType>,
    ) {}

    create(createMetaDatumDto: CreateMetaDatumDto) {
        return 'This action adds a new metaDatum';
    }

    // 获取所有的元数据
    async findAll() {
        return {
            achievementTypes: await this.achievementTypeRepository.find(),
            colleges: await this.collegeRepository.find(),
            majors: await this.majorRepository.find(),
            projectStatuses: await this.projectStatusRepository.find(),
            projectTypes: await this.projectTypeRepository.find(),
            identities: await this.identityRepository.find({
                where: { id: Not(4) }, // 剔除 id 为 4 的管理员身份
            }),
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} metaDatum`;
    }

    update(id: number, updateMetaDatumDto: UpdateMetaDatumDto) {
        return `This action updates a #${id} metaDatum`;
    }

    remove(id: number) {
        return `This action removes a #${id} metaDatum`;
    }
}
