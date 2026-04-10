import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  firstname!: string;

  @Column()
  age!: number;

  @Column()
  cin!: string;

  @Column()
  job!: string;

  @Column()
  path!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.cvs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToMany(() => Skill, (skill) => skill.cvs, { eager: false })
  @JoinTable()
  skills!: Skill[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
