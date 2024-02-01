import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './User.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, length: 100 })
  email: string;
  
  @Column()
  name: string;

  @Column({ length: 20, unique: true })
  contact: string;
  
  @ManyToOne(() => Users, (user) => user.id)
  user: Users;
}
