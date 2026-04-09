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

  async create(dto: CreateCvDto, userId: number): Promise<Cv> {
    const owner = await this.userRepository.findOne({ where: { id: userId } });
    if (!owner) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const cv = this.cvRepository.create({
      ...dto,
      userId,
      skillIds: dto.skillIds ?? [],
    });

    return this.cvRepository.save(cv);
  }

  findAll(): Promise<Cv[]> {
    return this.cvRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({ where: { id } });
    if (!cv) {
      throw new NotFoundException(`Cv ${id} not found`);
    }
    return cv;
  }

  async update(id: number, dto: UpdateCvDto, userId: number): Promise<Cv> {
    const cv = await this.findOne(id);
    this.assertOwnership(cv, userId);

    Object.assign(cv, dto);
    return this.cvRepository.save(cv);
  }

  async remove(
    id: number,
    userId: number,
  ): Promise<{ deleted: boolean; id: number }> {
    const cv = await this.findOne(id);
    this.assertOwnership(cv, userId);

    await this.cvRepository.delete(id);
    return { deleted: true, id };
  }

  async clear(): Promise<void> {
    await this.cvRepository.delete({});
  }

  private assertOwnership(cv: Cv, userId: number): void {
    if (cv.userId !== userId) {
      throw new ForbiddenException('You can only modify your own CV');
    }
  }
}
