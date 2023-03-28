import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RootService } from './root.service';
import { CreateRootDto } from './dto/create-root.dto';

@Controller('root')
export class RootController {
    constructor(private readonly rootService: RootService) {}

    @Post()
    create(@Body() createRootDto: CreateRootDto) {
        return this.rootService.create(createRootDto);
    }

    @Get()
    find() {
        return this.rootService.find(1);
    }

    @Get(':uuid')
    async getIdentity(@Param('uuid') uuid: string) {
        const { identity } = await this.rootService.getIdentity(uuid);
        return { identity: identity.name };
    }
}
