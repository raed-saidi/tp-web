import { IsInt, IsString } from 'class-validator';
export class CreateSkillDto {
    @IsString()
    designation!: string;

    @IsInt()
    cvId!: number;
}
