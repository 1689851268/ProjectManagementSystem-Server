import {
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsNumber({ allowNaN: false }, { message: 'type 必须是数字' })
    type: number;

    @IsNumber({ allowNaN: false }, { message: 'teacher 必须是数字' })
    teacher: number;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    publishTime: string;

    @IsOptional()
    @IsNumberString()
    applicationDate: string;

    @IsOptional()
    @IsNumber({ allowNaN: false }, { message: 'projectLeader 必须是数字' })
    projectLeader: number | null;

    @IsOptional()
    @IsNumber({ allowNaN: false }, { message: 'specialist 必须是数字' })
    specialist: number | null;

    @IsOptional()
    @IsNumber({ allowNaN: false }, { message: 'status 必须是数字' })
    status: number;

    @IsOptional()
    @IsNumberString()
    failureTime: string;

    @IsOptional()
    @IsNumberString()
    openTime: string;

    @IsOptional()
    @IsNumberString()
    finishTime: string;
}
