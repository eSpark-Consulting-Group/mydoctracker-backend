import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Users } from './User.entity';
import { Document } from './Document.entity';

export enum NotificationTypes {
  SOS = 'SOS',
  GEOFENCE = 'GEOFENCE',
  BATTERY = 'BATTERY',
}
@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: NotificationTypes })
  type: NotificationTypes;

  @Column()
  read: boolean;

  @CreateDateColumn({ precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
  sentAt: Date;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => Document, (document) => document.id)
  documentId: Document;
}
