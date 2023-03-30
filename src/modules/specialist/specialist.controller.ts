import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { CreateSpecialistDto } from './dto/create-specialist.dto';

@Controller('specialist')
export class SpecialistController {
    constructor(private readonly specialistService: SpecialistService) {}

    @Post()
    create(@Body() createSpecialistDto: CreateSpecialistDto) {
        // 处理 body 的数据格式
        createSpecialistDto = {
            password: createSpecialistDto.password,
            name: createSpecialistDto.name,
            registrationTime: `${new Date().getTime()}`,
            email: createSpecialistDto.email || '',
            phone: createSpecialistDto.phone || '',
            identity: 3,
        };
        return this.specialistService.create(createSpecialistDto);
    }

    // 通过 keyword 查询专家
    @Get()
    findAll(@Query('keyword') keyword: string) {
        return this.specialistService.findAll(keyword);
    }
}
