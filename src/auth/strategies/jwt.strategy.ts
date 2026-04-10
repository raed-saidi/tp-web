import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JwtPayload } from 'src/jwt-payload.interface';

const JWT_SECRET =
  process.env.jwt_secret ??
  process.env.JWT_SECRET ??
  process.env.SECRET_KEY ??
  'dev-jwt-secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
