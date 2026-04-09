import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.entity';
import { LoginDto } from './dto/login.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.AuthService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.AuthService.login(dto);
  }
}
