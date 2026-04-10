import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { CvService } from '../cv/cv.service';
import { SkillService } from '../skill/skill.service';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userService = app.get(UserService);
    const cvService = app.get(CvService);
    const skillService = app.get(SkillService);

    // Skills (standalone — not tied to a specific CV)
    const nestjs = await skillService.create({ designation: 'NestJS' });
    const postgres = await skillService.create({ designation: 'PostgreSQL' });
    const typescript = await skillService.create({ designation: 'TypeScript' });
    const testingApi = await skillService.create({ designation: 'Testing API' });
    const cypress = await skillService.create({ designation: 'Cypress' });
    const jest = await skillService.create({ designation: 'Jest' });
    const docker = await skillService.create({ designation: 'Docker' });
    const cicd = await skillService.create({ designation: 'CI/CD' });
    const linux = await skillService.create({ designation: 'Linux' });

    // Users
    const u1 = await userService.create({
      username: 'amine.benali',
      email: 'amine.benali@gmail.com',
      password: await bcrypt.hash('123456', 10),
      role: 'user',
    });

    const u2 = await userService.create({
      username: 'sarra.trabelsi',
      email: 'sarra.trabelsi@gmail.com',
      password: await bcrypt.hash('123456', 10),
      role: 'user',
    });

    const u3 = await userService.create({
      username: 'youssef.jaziri',
      email: 'youssef.jaziri@gmail.com',
      password: await bcrypt.hash('123456', 10),
      role: 'admin',
    });

    // CVs — skills linked via ManyToMany through skillIds
    await cvService.create(
      {
        name: 'Ben Ali',
        firstname: 'Amine',
        age: 24,
        cin: '14852369',
        job: 'Developpeur Backend',
        path: '/cv/amine-benali.pdf',
        skillIds: [nestjs.id, postgres.id, typescript.id],
      },
      { userId: u1.id, role: u1.role },
    );

    await cvService.create(
      {
        name: 'Trabelsi',
        firstname: 'Sarra',
        age: 23,
        cin: '12912568',
        job: 'Ingenieure QA',
        path: '/cv/sarra-trabelsi.pdf',
        skillIds: [testingApi.id, cypress.id, jest.id],
      },
      { userId: u2.id, role: u2.role },
    );

    await cvService.create(
      {
        name: 'Jaziri',
        firstname: 'Youssef',
        age: 26,
        cin: '12900066',
        job: 'DevOps Engineer',
        path: '/cv/youssef-jaziri.pdf',
        skillIds: [docker.id, cicd.id, linux.id],
      },
      { userId: u3.id, role: u3.role },
    );

    console.log('Seed Successful');
  } catch (error) {
    console.error('Echec du seed :', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
