import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { Cv } from '../cv/entities/cv.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(Cv)
    private readonly cvRepository: Repository<Cv>,
  ) {}

  async create(dto: CreateSkillDto): Promise<Skill> {
    const cv = await this.cvRepository.findOne({ where: { id: dto.cvId } });
    if (!cv) {
      throw new NotFoundException(`Cv ${dto.cvId} not found`);
    }

    const skill = this.skillRepository.create(dto);
    return this.skillRepository.save(skill);
  }

  findAll(): Promise<Skill[]> {
    return this.skillRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill ${id} not found`);
    }
    return skill;
  }

  async update(id: number, dto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findOne(id);

    if (dto.cvId !== undefined) {
      const cv = await this.cvRepository.findOne({ where: { id: dto.cvId } });
      if (!cv) {
        throw new NotFoundException(`Cv ${dto.cvId} not found`);
      }
    }

    Object.assign(skill, dto);
    return this.skillRepository.save(skill);
  }

  async remove(id: number): Promise<{ deleted: boolean; id: number }> {
    await this.findOne(id);
    await this.skillRepository.delete(id);
    return { deleted: true, id };
  }

  async clear(): Promise<void> {
    await this.skillRepository.delete({});
  }
}
