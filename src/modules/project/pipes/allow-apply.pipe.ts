import { Injectable, PipeTransform } from '@nestjs/common';
import { AllowApplyDto } from '../dto/allow-apply.dto';

@Injectable()
export class AllowApplyPipe implements PipeTransform {
    transform(allowApplyDto: AllowApplyDto) {
        allowApplyDto = {
            ...allowApplyDto,
            status: 3,
        };
        return allowApplyDto;
    }
}
