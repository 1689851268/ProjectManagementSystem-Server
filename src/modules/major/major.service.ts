import { Major } from '@/entities/Major';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';

@Injectable()
export class MajorService {
    constructor(
        @InjectRepository(Major)
        private majorRepository: Repository<Major>,
    ) {}

    create(createMajorDto: CreateMajorDto) {
        return 'This action adds a new major';
    }

    // 通过 collegeId 查询专业
    findByCollegeId(collegeId: number) {
        return this.majorRepository
            .createQueryBuilder('major')
            .where('major.college = :collegeId', { collegeId })
            .getMany();
    }

    findAll() {
        return `This action returns all major`;
    }

    findOne(id: number) {
        return `This action returns a #${id} major`;
    }

    update(id: number, updateMajorDto: UpdateMajorDto) {
        return `This action updates a #${id} major`;
    }

    remove(id: number) {
        return `This action removes a #${id} major`;
    }
}
