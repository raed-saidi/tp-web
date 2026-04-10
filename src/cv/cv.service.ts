import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Cv } from './entities/cv.entity';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private readonly cvRepository: Repository<Cv>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(
    dto: CreateCvDto,
    user: { userId: number; role: string },
  ): Promise<Cv> {
    const owner = await this.userRepository.findOne({
      where: { id: user.userId },
    });

    if (!owner) {
      throw new NotFoundException(`User ${user.userId} not found`);
    }

    const skills =
      dto.skillIds && dto.skillIds.length
        ? await this.skillRepository.findBy({ id: In(dto.skillIds) })
        : [];

    const cv = this.cvRepository.create({
      ...dto,
      user: owner,
      skills,
    });

    return this.cvRepository.save(cv);
  }

  findAllAdmin(): Promise<Cv[]> {
    return this.cvRepository.find({ relations: ['user', 'skills'] });
  }

  async findAll(user: { userId: number; role: string }) {
    if (!user) throw new UnauthorizedException();

    if (user.role === 'admin') {
      return this.cvRepository.find({
        relations: ['user', 'skills'],
      });
    }

    return this.cvRepository.find({
      where: { user: { id: user.userId } },
      relations: ['user', 'skills'],
    });
  }

  async findOne(
    id: number,
    user: { userId: number; role: string },
  ): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user', 'skills'],
    });

    if (!cv) throw new NotFoundException();

    if (user.role !== 'admin' && cv.user.id !== user.userId) {
      throw new ForbiddenException();
    }

    return cv;
  }

  async update(
    id: number,
    dto: UpdateCvDto,
    user: { userId: number; role: string },
  ): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user', 'skills'],
    });

    if (!cv) throw new NotFoundException();

    if (user.role !== 'admin' && cv.user.id !== user.userId) {
      throw new ForbiddenException();
    }

    if (dto.skillIds !== undefined) {
      cv.skills =
        dto.skillIds.length
          ? await this.skillRepository.findBy({ id: In(dto.skillIds) })
          : [];
    }

    const { skillIds: _, ...rest } = dto;
    Object.assign(cv, rest);
    return this.cvRepository.save(cv);
  }

  async remove(
    id: number,
    user: { userId: number; role: string },
  ): Promise<{ deleted: boolean; id: number }> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!cv) throw new NotFoundException();

    if (user.role !== 'admin' && cv.user.id !== user.userId) {
      throw new ForbiddenException();
    }

    await this.cvRepository.delete(id);
    return { deleted: true, id };
  }
}
