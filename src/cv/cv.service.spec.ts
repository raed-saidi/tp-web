import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { Cv } from './entities/cv.entity';
import { User } from '../user/entities/user.entity';

describe('CvService', () => {
  let service: CvService;
  let createCvDto: CreateCvDto;
  let storedCv: Cv | undefined;
  const ownerUser = { id: 7, role: 'user' } as User;
  const otherUser = { id: 9, role: 'user' } as User;

  beforeEach(async () => {
    storedCv = undefined;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CvService,
        {
          provide: getRepositoryToken(Cv),
          useValue: {
            findOne: jest.fn(({ where }: { where: { id: number } }) =>
              Promise.resolve(storedCv?.id === where.id ? storedCv : undefined),
            ),
            find: jest.fn(() => Promise.resolve(storedCv ? [storedCv] : [])),
            create: (value: Cv) => value,
            save: (value: Cv) => {
              storedCv = value;
              return Promise.resolve(value);
            },
            delete: jest.fn(() => Promise.resolve(undefined)),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(({ where }: { where: { id: number } }) =>
              Promise.resolve(
                where.id === ownerUser.id ? ownerUser : undefined,
              ),
            ),
            find: jest.fn(() => Promise.resolve([ownerUser])),
          },
        },
      ],
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

  it('assigns the authenticated user as CV owner during creation', async () => {
    const cv = await service.create(createCvDto, ownerUser);

    expect(cv.userId).toBe(7);
    expect(cv.skillIds).toEqual([1, 2]);
  });

  it('prevents a non-owner from updating a CV', async () => {
    const cv = await service.create(createCvDto, ownerUser);

    await expect(
      service.update(cv.id, { job: 'QA Engineer' }, otherUser),
    ).rejects.toThrow(ForbiddenException);
  });

  it('prevents a non-owner from deleting a CV', async () => {
    const cv = await service.create(createCvDto, ownerUser);

    await expect(service.remove(cv.id, otherUser)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('throws when trying to remove a missing CV', async () => {
    await expect(service.remove(999, ownerUser)).rejects.toThrow(
      NotFoundException,
    );
  });
});
