import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  // arbitrary JSON object with resume fields
  @Column('simple-json')
  data: any;

  @ManyToOne(() => User, (user) => user.resumes, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
