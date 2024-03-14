import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Admin } from './Admin.entity';
import { Exclude } from 'class-transformer';
import { Document } from './Document.entity';

@Entity()
export class DeviceInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Exclude()
  @Column({ unique: true, length: 17 })
  macAddress: string;

  @Column({ type: 'boolean', default: false })
  notificationFlag: boolean;

  @ManyToOne(() => Admin, (admin) => admin.id)
  addedBy: Admin;

  @Column({ type: 'json', default: null, nullable: true })
  lastActivity: LastActivity;

  @OneToOne(() => Document, (doc) => doc.tracker)
  document: Document;
}
export interface LastActivity {
  batteryPercentage: number;
  lat: number;
  lng: number;
  sentAt: Date;
  state: string;
  nextUpdateAt: Date;
}
