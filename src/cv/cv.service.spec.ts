import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';

describe('CvService', () => {
  let service: CvService;
  let createCvDto: CreateCvDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvService],
    }).compile();

    service = module.get<CvService>(CvService);
    createCvDto = {
      name: 'Doe',
      firstname: 'John',
      age: 25,
      cin: '12345678',
      job: 'Backend Developer',
      path: '/cv/john-doe.pdf',
      skillIds: [1, 2],
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('assigns the authenticated user as CV owner during creation', () => {
    const cv = service.create(createCvDto, 7);

    expect(cv.userId).toBe(7);
    expect(cv.skillIds).toEqual([1, 2]);
  });

  it('prevents a non-owner from updating a CV', () => {
    const cv = service.create(createCvDto, 3);

    expect(() => service.update(cv.id, { job: 'QA Engineer' }, 9)).toThrow(
      ForbiddenException,
    );
  });

  it('prevents a non-owner from deleting a CV', () => {
    const cv = service.create(createCvDto, 3);

    expect(() => service.remove(cv.id, 9)).toThrow(ForbiddenException);
  });

  it('throws when trying to remove a missing CV', () => {
    expect(() => service.remove(999, 1)).toThrow(NotFoundException);
  });
});
