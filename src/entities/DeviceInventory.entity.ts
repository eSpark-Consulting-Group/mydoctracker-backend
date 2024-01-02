import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Admin } from './Admin.entity';

@Entity()
export class DeviceInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ unique: true, length: 17 })
  macAddress: string;

  @ManyToOne(() => Admin, (admin) => admin.id)
  addedBy: Admin;
}
