import { Injectable, PipeTransform } from '@nestjs/common';
import { ApplyProjectDto } from '../dto/apply-project.dto';

@Injectable()
export class ApplyProjectPipe implements PipeTransform {
    transform(applyProjectDto: ApplyProjectDto) {
        applyProjectDto = {
            ...applyProjectDto,
            applicationDate: `${Date.now()}`,
            status: 2,
        };
        return applyProjectDto;
    }
}
