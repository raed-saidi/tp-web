import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../enum/role.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string = '';

  @IsEmail()
  email: string = '';

  @IsString()
  @MinLength(6)
  password: string = '';

  @IsEnum(Role)
  role?: Role;
}
