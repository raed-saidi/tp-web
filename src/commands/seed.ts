import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { CvService } from '../cv/cv.service';
import { SkillService } from '../skill/skill.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userService = app.get(UserService);
    const cvService = app.get(CvService);
    const skillService = app.get(SkillService);

    // Users 
    const u1 = userService.create({
      username: 'amine.benali',
      email: 'amine.benali@gmail.com',
      password: '123456',
      role: 'user',
    });

    const u2 = userService.create({
      username: 'sarra.trabelsi',
      email: 'sarra.trabelsi@gmail.com',
      password: '123456',
      role: 'user',
    });

    const u3 = userService.create({
      username: 'youssef.jaziri',
      email: 'youssef.jaziri@gmail.com',
      password: '123456',
      role: 'admin',
    });

    // CVs
    const cv1 = cvService.create({
      name: 'Ben Ali',
      firstname: 'Amine',
      age: 24,
      cin: '14852369',
      job: 'Developpeur Backend',
      path: '/cv/amine-benali.pdf',
      skillIds: [],
    }, u1.id);

    const cv2 = cvService.create({
      name: 'Trabelsi',
      firstname: 'Sarra',
      age: 23,
      cin: '12912568',
      job: 'Ingenieure QA',
      path: '/cv/sarra-trabelsi.pdf',
      skillIds: [],
    }, u2.id);

    const cv3 = cvService.create({
      name: 'Jaziri',
      firstname: 'Youssef',
      age: 26,
      cin: '12900066',
      job: 'DevOps Engineer',
      path: '/cv/youssef-jaziri.pdf',
      skillIds: [],
    }, u3.id);

    // Skills
    skillService.create({ designation: 'NestJS', cvId: cv1.id });
    skillService.create({ designation: 'PostgreSQL', cvId: cv1.id });
    skillService.create({ designation: 'TypeScript', cvId: cv1.id });

    skillService.create({ designation: 'Testing API', cvId: cv2.id });
    skillService.create({ designation: 'Cypress', cvId: cv2.id });
    skillService.create({ designation: 'Jest', cvId: cv2.id });

    skillService.create({ designation: 'Docker', cvId: cv3.id });
    skillService.create({ designation: 'CI/CD', cvId: cv3.id });
    skillService.create({ designation: 'Linux', cvId: cv3.id });

    console.log('Seed Successful');
  } catch (error) {
    console.error('Echec du seed :', error);
  } finally {
    await app.close();
  }
}

bootstrap();