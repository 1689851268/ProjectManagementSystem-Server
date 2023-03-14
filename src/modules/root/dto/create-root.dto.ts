import { Identity } from 'src/entities/Identity';
import { DeepPartial } from 'typeorm';

export class CreateRootDto {
    password: string;
    identity: DeepPartial<Identity>;
}
