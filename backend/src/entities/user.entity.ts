import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: Resume[];
}
