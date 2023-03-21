import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { MetaDataService } from './meta-data.service';
import { CreateMetaDatumDto } from './dto/create-meta-datum.dto';
import { UpdateMetaDatumDto } from './dto/update-meta-datum.dto';

@Controller('meta-data')
export class MetaDataController {
    constructor(private readonly metaDataService: MetaDataService) {}

    @Post()
    create(@Body() createMetaDatumDto: CreateMetaDatumDto) {
        return this.metaDataService.create(createMetaDatumDto);
    }

    @Get()
    findAll() {
        return this.metaDataService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.metaDataService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateMetaDatumDto: UpdateMetaDatumDto,
    ) {
        return this.metaDataService.update(+id, updateMetaDatumDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.metaDataService.remove(+id);
    }
}
