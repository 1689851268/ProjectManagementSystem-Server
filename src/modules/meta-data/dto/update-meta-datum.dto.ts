import { PartialType } from '@nestjs/mapped-types';
import { CreateMetaDatumDto } from './create-meta-datum.dto';

export class UpdateMetaDatumDto extends PartialType(CreateMetaDatumDto) {}
