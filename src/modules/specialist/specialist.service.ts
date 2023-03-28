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
}
