import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialist } from 'src/entities/Specialist';
import { Repository } from 'typeorm';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';

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

    findAll() {
        return `This action returns all specialist`;
    }

    findOne(id: number) {
        return `This action returns a #${id} specialist`;
    }

    update(id: number, updateSpecialistDto: UpdateSpecialistDto) {
        return `This action updates a #${id} specialist`;
    }

    remove(id: number) {
        return `This action removes a #${id} specialist`;
    }
}
