import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  password!: string;

  @IsEmail()
  email!: string;
}
