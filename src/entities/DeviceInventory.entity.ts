import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
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

  @Column({ type: 'numeric', default: 100 })
  batteryPercentage: number;

  @ManyToOne(() => Admin, (admin) => admin.id)
  addedBy: Admin;
}
