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
}
