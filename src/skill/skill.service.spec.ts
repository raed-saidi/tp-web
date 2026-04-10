import { Test, TestingModule } from '@nestjs/testing';
import { SkillService } from './skill.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Cv } from '../cv/entities/cv.entity';

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillService,
        {
          provide: getRepositoryToken(Skill),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: (value: Skill) => value,
            save: (value: Skill) => Promise.resolve(value),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Cv),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SkillService>(SkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
