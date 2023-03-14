import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Root } from 'src/entities/Root';
import { Repository } from 'typeorm';
import { CreateRootDto } from './dto/create-root.dto';
import { UpdateRootDto } from './dto/update-root.dto';

@Injectable()
export class RootService {
    constructor(
        @InjectRepository(Root)
        private readonly rootRepository: Repository<Root>,
    ) {}

    create(createRootDto: CreateRootDto) {
        const newRoot = this.rootRepository.create(createRootDto);
        return this.rootRepository.save(newRoot);
    }

    find(id: number) {
        return this.rootRepository.findAndCount({
            where: { id },
            relations: {
                identity: true,
            },
        });
    }

    getIdentity(uuid: string) {
        return this.rootRepository.find({
            where: {
                uuid,
            },
            relations: {
                identity: true,
            },
        });
    }

    update(id: number, updateRootDto: UpdateRootDto) {
        console.log(updateRootDto);
        return `This action updates a #${id} root`;
    }

    remove(id: number) {
        return `This action removes a #${id} root`;
    }
}
