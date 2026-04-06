import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillService {
  private skills: Skill[] = [];
  private nextId = 1;

  create(dto: CreateSkillDto): Skill {
    const skill: Skill = {
      id: this.nextId++,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.skills.push(skill);
    return skill;
  }

  findAll(): Skill[] {
    return this.skills;
  }

  findOne(id: number): Skill {
    const skill = this.skills.find((item) => item.id === id);
    if (!skill) {
      throw new NotFoundException(`Skill ${id} not found`);
    }
    return skill;
  }

  update(id: number, dto: UpdateSkillDto): Skill {
    const skill = this.findOne(id);
    Object.assign(skill, dto, { updatedAt: new Date() });
    return skill;
  }

  remove(id: number): { deleted: boolean; id: number } {
    const index = this.skills.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Skill ${id} not found`);
    }

    this.skills.splice(index, 1);
    return { deleted: true, id };
  }
}