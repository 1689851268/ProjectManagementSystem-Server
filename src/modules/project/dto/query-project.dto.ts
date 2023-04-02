import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class QueryProjectDto {
    @IsString()
    projectName: string;

    @IsString()
    college: string;

    @IsString()
    teacher: string;

    @IsString()
    projectType: string;

    @IsString()
    projectStatus: string;

    @IsNumberString()
    curPage: string;

    @IsNumberString()
    pageSize: string;
}

export class realQueryProjectDto {
    @IsString()
    projectName: string;

    @IsString()
    college: string;

    @IsString()
    teacher: string;

    @IsNumber()
    projectType: number;

    @IsNumber()
    projectStatus: number;

    @IsNumber()
    curPage: number;

    @IsNumber()
    pageSize: number;
}
