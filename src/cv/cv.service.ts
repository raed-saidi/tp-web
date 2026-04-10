import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cv } from './entities/cv.entity';
import { User } from '../user/entities/user.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private readonly cvRepository: Repository<Cv>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    const cv = this.cvRepository.create({
      ...dto,
      user: owner,
      skillIds: dto.skillIds ?? [],
    });

    return this.cvRepository.save(cv);
  }

  async findAll(user: { userId: number; role: string }) {
    if (!user) throw new UnauthorizedException();

    if (user.role === 'admin') {
      return this.cvRepository.find({
        relations: ['user'],
      });
    }

    return this.cvRepository.find({
      where: { user: { id: user.userId } },
      relations: ['user'],
    });
  }

  async findOne(
    id: number,
    user: { userId: number; role: string },
  ): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user'],
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
      relations: ['user'],
    });

    if (!cv) throw new NotFoundException();

    if (user.role !== 'admin' && cv.user.id !== user.userId) {
      throw new ForbiddenException();
    }

    Object.assign(cv, dto);
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
