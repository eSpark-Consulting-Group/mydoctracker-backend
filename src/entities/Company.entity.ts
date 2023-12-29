import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne } from 'typeorm';
import { User } from './User.entity';

@Entity()
@Index('IDX_user_email', ['email'])
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column()
  contact: string;

  @OneToOne(() => User, user => user.company)
  user: User;
}
