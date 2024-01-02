import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum UserRoles {
  SU = 'SU',
  CU = 'CU',
  BCU = 'BCU',
  ACU = 'ACU',
  RCU = 'RCU',
}
export enum Status {
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

  @Column()
  profilePicture: string;

  @Column({ length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  employeePassword: string;

  @Column()
  hashedPassword: string;

  @Column({ length: 20 })
  contact: string;

  @Column({ type: 'enum', enum: UserRoles, default: 'SU' })
  role: UserRoles;

  @Column({ type: 'enum', enum: Status, default: 'ACTIVE' })
  status: Status;
}
