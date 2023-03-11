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
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Controller('college')
export class CollegeController {
    constructor(private readonly collegeService: CollegeService) {}

    @Post()
    create(@Body() createCollegeDto: CreateCollegeDto) {
        return this.collegeService.create(createCollegeDto);
    }

    @Get()
    find(@Query('keyword') keyword: string) {
        return this.collegeService.find(keyword);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCollegeDto: UpdateCollegeDto,
    ) {
        return this.collegeService.update(+id, updateCollegeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.collegeService.remove(+id);
    }
}
