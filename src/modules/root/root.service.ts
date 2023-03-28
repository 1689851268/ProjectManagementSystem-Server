import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Root } from 'src/entities/Root';
import { Repository } from 'typeorm';
import { CreateRootDto } from './dto/create-root.dto';

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
        return this.rootRepository
            .createQueryBuilder('root')
            .leftJoinAndSelect('root.identity', 'identity')
            .where('root.uuid = :uuid', { uuid })
            .getOne();
    }
}
