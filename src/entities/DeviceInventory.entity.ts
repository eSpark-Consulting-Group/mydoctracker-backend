import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Admin } from './Admin.entity';

@Entity()
export class DeviceInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ unique: true })
  macAddress: string;

  @ManyToOne(() => Admin, (admin) => admin.id)
  addedBy: Admin;
}
