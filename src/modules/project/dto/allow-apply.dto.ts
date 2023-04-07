import { Equals, IsNumber, IsOptional } from 'class-validator';

export class AllowApplyDto {
    @IsNumber({ allowNaN: false }, { message: 'projectId 必须是数字' })
    projectId: number;

    @IsNumber({ allowNaN: false }, { message: 'applyUserId 必须是数字' })
    specialist: number;

    @IsOptional()
    @Equals(3)
    status: 3;
}
