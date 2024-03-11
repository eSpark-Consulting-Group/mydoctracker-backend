import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subsidiary } from './Subsidiary.entity';

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

  @Column({ nullable: true, default: null })
  firstName: string;

  @Column({ nullable: true, default: null })
  lastName: string;

  @Column()
  address: string;

  @Column({ nullable: true, default: null })
  companyName: string;

  @Column({ nullable: true, default: null })
  profilePicture: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  @Exclude()
  hashedPassword: string;

  @Column({ length: 20, unique: true })
  contact: string;

  @Column({ nullable: true, default: null })
  fileId: string;

  @Column({ type: 'text', nullable: true, default: null, select: false })
  reset_token: string;

  @Column({ type: 'enum', enum: UserRoles, default: 'SU' })
  role: UserRoles;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'json', default: null, nullable: true })
  accessibility: UserAccessibility;

  @Exclude()
  @Column({ type: 'json', default: null, nullable: true })
  meta: UserMeta;

  @ManyToOne(() => Subsidiary, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subsidiary' })
  @Column({ default: null, type: 'varchar', length: 36 })
  subsidiary: string;
}

export interface UserMeta {
  reset_history: Array<{
    generated_at: Date;
    expires_at: Date;
    password_updated_at: Date;
    ip: string;
    device: string;
    oldPasswordHash: string;
  }>;
}
export interface UserAccessibility {
  doc: boolean;
  share: boolean;
}
