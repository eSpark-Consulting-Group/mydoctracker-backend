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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: NotificationTypes })
  type: NotificationTypes;

  @Column()
  read: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => Document, (document) => document.id)
  documentId: Document;
}
