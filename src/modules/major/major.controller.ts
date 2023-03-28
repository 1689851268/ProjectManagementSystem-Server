import { Controller, Get, Query } from '@nestjs/common';
import { MajorService } from './major.service';

@Controller('major')
export class MajorController {
    constructor(private readonly majorService: MajorService) {}

    @Get()
    getMajorByCollegeId(@Query('collegeId') collegeId: number) {
        return this.majorService.findByCollegeId(+collegeId);
    }
}
