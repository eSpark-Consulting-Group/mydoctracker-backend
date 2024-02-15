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
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
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
  createdBy: Users;

  @ManyToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'attendedBy' })
  attendedBy: Users;

  @ManyToOne(() => Subsidiary, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subsidiary' })
  subsidiary: Subsidiary;

  @OneToOne(() => Document, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @Column()
  documentId: string;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;
}
