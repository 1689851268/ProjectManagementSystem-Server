import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { MajorService } from './major.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';

@Controller('major')
export class MajorController {
    constructor(private readonly majorService: MajorService) {}

    @Post()
    create(@Body() createMajorDto: CreateMajorDto) {
        return this.majorService.create(createMajorDto);
    }

    @Get()
    getMajorByCollegeId(@Query('collegeId') collegeId: number) {
        return this.majorService.findByCollegeId(+collegeId);
    }

    @Get()
    findAll() {
        return this.majorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.majorService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMajorDto: UpdateMajorDto) {
        return this.majorService.update(+id, updateMajorDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.majorService.remove(+id);
    }
}
