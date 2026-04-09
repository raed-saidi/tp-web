import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { Skill } from './entities/skill.entity';
import { Cv } from '../cv/entities/cv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, Cv])],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule {}
