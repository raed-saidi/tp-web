import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from '../common/middleware/auth.middleware';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Cv, User, Skill])],
  controllers: [CvController],
  providers: [CvService, JwtService, RolesGuard],
})
export class CvModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'cv', method: RequestMethod.POST },
        { path: 'cv/:id', method: RequestMethod.PATCH },
        { path: 'cv/:id', method: RequestMethod.DELETE },
      );
  }
}
