import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './User.entity';

@Entity()
export class Reports {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  description: string;

  @Column()
  file: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;
}
