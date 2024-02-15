import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './User.entity';

@Entity({ name: 'company' })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  contact: string;

  @ManyToOne(() => Users, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: Users;
}
