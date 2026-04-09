import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.entity';
import { LoginDto } from './dto/login.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  users: User[] = [];
  async register(dto: RegisterDto) {
    const exists = this.users.find((u) => u.username === dto.username);
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user: User = {
      id: this.users.length + 1,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: 'user',
    };

    this.users.push(user);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = this.users.find((u) => u.username === dto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
