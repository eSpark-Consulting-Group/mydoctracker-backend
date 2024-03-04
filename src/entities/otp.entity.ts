import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './User.entity';

export enum OtpPurpose {
  add_document = 'add_document',
  reset_employee_password = 'reset_employee_password',
}

@Entity()
export class OTP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  otp: number;

  @Column({ type: 'enum', enum: OtpPurpose, nullable: false })
  purpose: OtpPurpose;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
