import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { Admin } from './Admin.entity';
import { Document } from './Document.entity';

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

  @OneToOne(() => Document, (document) => document.assignee)
  document: Document;
}
