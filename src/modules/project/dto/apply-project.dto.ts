import { Equals, IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class ApplyProjectDto {
    @IsNumber({ allowNaN: false }, { message: 'projectId 必须是数字' })
    projectId: number;

    @IsNumber({ allowNaN: false }, { message: 'applyUserId 必须是数字' })
    applyUserId: number;

    @IsNumber(
        { allowNaN: false },
        { each: true, message: 'teammateId 必须为数字数组' },
    )
    teammateId: number[];

    @IsOptional()
    @IsNumberString()
    applicationDate: string;

    @IsOptional()
    @Equals(2)
    status: 2;
}
