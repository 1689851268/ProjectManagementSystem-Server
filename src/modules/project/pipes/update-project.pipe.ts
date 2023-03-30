import { Injectable, PipeTransform } from '@nestjs/common';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class UpdateProjectPipe implements PipeTransform {
    transform(value: UpdateProjectDto) {
        value.type = +value.type;
        return value;
    }
}
