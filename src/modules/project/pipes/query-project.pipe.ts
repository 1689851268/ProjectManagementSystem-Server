import { Injectable, PipeTransform } from '@nestjs/common';
import { QueryProjectDto, realQueryProjectDto } from '../dto/query-project.dto';

@Injectable()
export class QueryProjectPipe implements PipeTransform {
    transform(queryProjectDto: QueryProjectDto): realQueryProjectDto {
        const { curPage, pageSize, projectType, projectStatus } =
            queryProjectDto;

        const newQueryProjectDto = {
            ...queryProjectDto,
            curPage: +curPage,
            pageSize: +pageSize,
            projectType: +projectType,
            projectStatus: +projectStatus,
        };

        return newQueryProjectDto;
    }
}
