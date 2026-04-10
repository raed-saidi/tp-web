import { NestFactory } from '@nestjs/core';
import {
  randEmail,
  randFirstName,
  randJobTitle,
  randLastName,
  randNumber,
  randUserName,
  randWord,
} from '@ngneat/falso';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { CvService } from '../cv/cv.service';
import { SkillService } from '../skill/skill.service';
import { UserService } from '../user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userService = app.get(UserService);
    const cvService = app.get(CvService);
    const skillService = app.get(SkillService);

    // Skills pool — generated with @ngneat/falso
    const skillDesignations = randWord({ length: 10 });
    const skills = await Promise.all(
      skillDesignations.map((designation) =>
        skillService.create({ designation }),
      ),
    );

    // Users
    const password = await bcrypt.hash('password123', 10);

    const users = await Promise.all(
      Array.from({ length: 5 }).map(() =>
        userService.create({
          username: randUserName(),
          email: randEmail(),
          password,
          role: 'user',
        }),
      ),
    );

    // Admin
    const admin = await userService.create({
      username: randUserName(),
      email: randEmail(),
      password,
      role: 'admin',
    });

    // CVs — one per user, each with 3 random skills
    for (const user of [...users, admin]) {
      const skillIds = skills
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((s) => s.id);

      const cin = String(randNumber({ min: 10000000, max: 99999999 }));

      await cvService.create(
        {
          name: randLastName(),
          firstname: randFirstName(),
          age: randNumber({ min: 22, max: 55 }),
          cin,
          job: randJobTitle(),
          path: `/cv/${cin}.pdf`,
          skillIds,
        },
        { userId: user.id, role: user.role },
      );
    }

    console.log('Seed successful');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
