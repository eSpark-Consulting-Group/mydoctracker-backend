import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
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
}
