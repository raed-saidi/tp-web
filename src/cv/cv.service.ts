import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { User } from '../user/entities/user.entity';

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
    user: { id: number; role: string },
  ): Promise<Cv> {
    const owner = await this.userRepository.findOne({ where: { id: user.id } });
    if (!owner) {
      throw new NotFoundException(`User ${user.id} not found`);
    }

    const cv = this.cvRepository.create({
      ...dto,
      userId: user.id,
      skillIds: dto.skillIds ?? [],
    });

    return this.cvRepository.save(cv);
  }
  async findAll(user: { id: number; role: string }): Promise<Cv[]> {
    if (user.role === 'admin') {
      return this.cvRepository.find({ relations: ['user'] });
    }

    return this.cvRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }

  async findOne(id: number, user: { id: number; role: string }): Promise<Cv> {
    const cv = await this.cvRepository.findOne({ where: { id } });
    if (!cv) {
      throw new NotFoundException(`Cv ${id} not found`);
    }

    this.assertOwnership(cv, user);
    return cv;
  }

  async update(
    id: number,
    dto: UpdateCvDto,
    user: { id: number; role: string },
  ): Promise<Cv> {
    const cv = await this.findOne(id, user);
    this.assertOwnership(cv, user);

    Object.assign(cv, dto);
    return this.cvRepository.save(cv);
  }

  async remove(
    id: number,
    user: { id: number; role: string },
  ): Promise<{ deleted: boolean; id: number }> {
    const cv = await this.findOne(id, user);
    this.assertOwnership(cv, user);

    await this.cvRepository.delete(id);
    return { deleted: true, id };
  }

  async clear(): Promise<void> {
    await this.cvRepository.delete({});
  }

  private assertOwnership(cv: Cv, user: { id: number; role: string }) {
    if (user.role === 'admin') return;

    if (cv.userId !== user.id) {
      throw new ForbiddenException();
    }
  }
}
