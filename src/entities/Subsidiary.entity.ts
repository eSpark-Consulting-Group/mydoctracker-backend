import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Users } from './User.entity';

@Entity()
@Unique(['createdBy', 'name'])
export class Subsidiary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Users, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  @Column({ type: 'varchar', length: 36 })
  createdBy: string;

  @OneToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'admin' })
  @Column({ type: 'varchar', length: 36, default: null })
  admin: string;
}
