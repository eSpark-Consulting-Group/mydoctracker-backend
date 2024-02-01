import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './User.entity';

@Entity()
export class Subsidiary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: string;
  
  @Column()
  name: string;

  @ManyToOne(() => Users, (user) => user.id)
  company: Users;
}
