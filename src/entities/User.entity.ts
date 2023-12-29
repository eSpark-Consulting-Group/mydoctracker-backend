import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './Company.entity';

export enum UserRoles {
  COPORATE = 'COPORATE',
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
}

export enum UserRoleTypes {
  BASIC = 'BASIC',
  DEFAULT = 'DEFAULT',
  ADMIN = 'ADMIN',
}

@Entity()
@Index('IDX_user_email', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  contact: string;

  @Column({ type: 'enum', enum: UserRoles, nullable: false })
  role: UserRoles;

  @Column({ type: 'enum', enum: UserRoleTypes, nullable: true, default: null })
  roleType: UserRoleTypes;

  @OneToOne(() => Company, (company) => company.user, { cascade: true })
  @JoinColumn()
  company: Company;
}
