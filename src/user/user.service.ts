import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existsByUsername = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (existsByUsername) {
      throw new BadRequestException('Username already exists');
    }

    const existsByEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existsByEmail) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.userRepository.create({
      ...dto,
      role: dto.role ?? 'user',
    });

    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.username && dto.username !== user.username) {
      const exists = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (exists) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (dto.email && dto.email !== user.email) {
      const exists = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (exists) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<{ deleted: boolean; id: number }> {
    await this.findOne(id);
    await this.userRepository.delete(id);
    return { deleted: true, id };
  }

  async clear(): Promise<void> {
    await this.userRepository.delete({});
  }
}
