import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialist } from 'src/entities/Specialist';
import { Repository } from 'typeorm';
import { CreateSpecialistDto } from './dto/create-specialist.dto';

@Injectable()
export class SpecialistService {
    constructor(
        @InjectRepository(Specialist)
        private readonly specialistRepository: Repository<Specialist>,
    ) {}

    create(createSpecialistDto: CreateSpecialistDto) {
        const newSpecialist =
            this.specialistRepository.create(createSpecialistDto);
        return this.specialistRepository.save(newSpecialist);
    }

    // 通过 keyword 查询专家
    findAll(keyword: string) {
        // keyword 可能为 name / uuid, 需要进行模糊查询
        // 使用 QueryBuilder 查询数据
        return this.specialistRepository
            .createQueryBuilder()
            .where('name like :keyword', { keyword: `%${keyword}%` })
            .orWhere('uuid like :keyword', { keyword: `%${keyword}%` })
            .getMany();
    }
}
