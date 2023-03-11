import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { College } from 'src/entities/College';
import { Like, Repository } from 'typeorm';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Injectable()
export class CollegeService {
    constructor(
        @InjectRepository(College)
        private readonly collegeRepository: Repository<College>,
    ) {}

    create(createCollegeDto: CreateCollegeDto) {
        const newCollege = this.collegeRepository.create(createCollegeDto);
        return this.collegeRepository.save(newCollege);
    }

    find(keyWord = '') {
        if (keyWord) {
            return this.collegeRepository.findAndCount({
                where: { name: Like(`%${keyWord}%`) },
            });
        } else {
            return this.collegeRepository.findAndCount({});
        }
    }

    update(id: number, updateCollegeDto: UpdateCollegeDto) {
        return this.collegeRepository.update(id, updateCollegeDto);
    }

    remove(id: number) {
        return this.collegeRepository.delete(id);
    }
}
