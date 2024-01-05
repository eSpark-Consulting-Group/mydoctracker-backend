import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum UserRoles {
  SU = 'SU',
  CU = 'CU',
  BCU = 'BCU',
  ACU = 'ACU',
  RCU = 'RCU',
}
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
}

@Entity()
@Index('IDX_user_email', ['email'])
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, default: null })
  profilePicture: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ nullable: true, default: null })
  employeePassword: string;

  @Column()
  hashedPassword: string;

  @Column({ length: 20, unique: true })
  contact: string;

  @Column({ nullable: true, default: null })
  fileId: string;

  @Column({ type: 'enum', enum: UserRoles, default: 'SU' })
  role: UserRoles;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;
}
