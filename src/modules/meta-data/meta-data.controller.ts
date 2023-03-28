import { Controller, Get } from '@nestjs/common';
import { MetaDataService } from './meta-data.service';

@Controller('meta-data')
export class MetaDataController {
    constructor(private readonly metaDataService: MetaDataService) {}

    @Get()
    findAll() {
        return this.metaDataService.findAll();
    }
}
