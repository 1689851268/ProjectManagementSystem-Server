import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';

@Injectable()
export class CreateProjectPipe implements PipeTransform {
    transform(createProjectDto: CreateProjectDto) {
        createProjectDto = {
            ...createProjectDto,
            publishTime: `${Date.now()}`,
            applicationDate: '',
            failureTime: '',
            openTime: '',
            projectLeader: null,
            finishTime: '',
            specialist: null,
            status: 1,
        };
        return createProjectDto;
    }
}
