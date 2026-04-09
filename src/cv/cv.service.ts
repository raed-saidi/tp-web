import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';

@Injectable()
export class CvService {
  private cvs: Cv[] = [];
  private nextId = 1;

  create(dto: CreateCvDto, userId: number): Cv {
    const cv: Cv = {
      id: this.nextId++,
      ...dto,
      userId,
      skillIds: dto.skillIds ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.cvs.push(cv);
    return cv;
  }

  findAll(): Cv[] {
    return this.cvs;
  }

  findOne(id: number): Cv {
    const cv = this.cvs.find((item) => item.id === id);
    if (!cv) {
      throw new NotFoundException(`Cv ${id} not found`);
    }
    return cv;
  }

  update(id: number, dto: UpdateCvDto, userId: number): Cv {
    const cv = this.findOne(id);
    this.assertOwnership(cv, userId);

    Object.assign(cv, dto, { updatedAt: new Date() });
    return cv;
  }

  remove(id: number, userId: number): { deleted: boolean; id: number } {
    const cv = this.findOne(id);
    this.assertOwnership(cv, userId);
    const index = this.cvs.findIndex((item) => item.id === id);

    this.cvs.splice(index, 1);
    return { deleted: true, id };
  }

  private assertOwnership(cv: Cv, userId: number): void {
    if (cv.userId !== userId) {
      throw new ForbiddenException('You can only modify your own CV');
    }
  }
}
