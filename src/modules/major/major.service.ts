import { Major } from '@/entities/Major';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MajorService {
    constructor(
        @InjectRepository(Major)
        private majorRepository: Repository<Major>,
    ) {}

    // 通过 collegeId 查询专业
    findByCollegeId(collegeId: number) {
        return this.majorRepository
            .createQueryBuilder('major')
            .where('major.college = :collegeId', { collegeId })
            .getMany();
    }
}
