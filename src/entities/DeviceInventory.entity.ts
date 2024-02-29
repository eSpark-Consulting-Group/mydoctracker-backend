import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Admin } from './Admin.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class DeviceInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Exclude()
  @Column({ unique: true, length: 17 })
  macAddress: string;

  @ManyToOne(() => Admin, (admin) => admin.id)
  addedBy: Admin;

  @Column({ type: 'json', default: null, nullable: true })
  lastActivity: LastActivity;
}
export interface LastActivity {
  batteryPercentage: number;
  lat: number;
  lng: number;
  sentAt: Date;
  state: string;
  nextUpdateAt: number;
}
