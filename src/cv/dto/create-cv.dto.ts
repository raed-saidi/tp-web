import { IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
export class CreateCvDto {
  @IsString()
  name: string;

  @IsString()
  firstname: string;

  @IsInt()
  @Min(15)
  @Max(100)
  age: number;

  @IsString()
  cin: string;

  @IsString()
  job: string;

  @IsString()
  path: string;

  @IsInt()
  userId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  skillIds?: number[];
}