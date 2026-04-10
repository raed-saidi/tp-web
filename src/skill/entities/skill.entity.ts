import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  designation!: string;

  @ManyToMany(() => Cv, (cv) => cv.skills)
  cvs!: Cv[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
