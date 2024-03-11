import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './User.entity';
import { Subsidiary } from './Subsidiary.entity';
import { Document } from './Document.entity';

export enum RequestType {
  DOC = 'DOC',
  SHARE = 'SHARE',
}
export enum RequestStatus {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}
@Entity()
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', default: null, nullable: true })
  meta: any;

  @Column({ type: 'enum', enum: RequestType })
  type: RequestType;

  @ManyToOne(() => Users, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  @Column({ type: 'varchar', length: 36 })
  createdBy: string;

  @ManyToOne(() => Subsidiary, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subsidiary' })
  @Column({ type: 'varchar', length: 36 })
  subsidiary: string;

  @OneToOne(() => Document, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document' })
  @Column({ type: 'varchar', length: 36 })
  document: string;
}
