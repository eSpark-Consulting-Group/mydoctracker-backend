import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Users } from './User.entity';
import { DeviceInventory } from './DeviceInventory.entity';

export enum DocumentType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => DeviceInventory, (device) => device.id)
  trackerId: DeviceInventory;

  @Column({ type: 'enum', enum: DocumentType })
  type: DocumentType;

  @Column()
  title: string;

  @Column()
  creationDate: Date;

  @Column()
  file: string;

  @Column()
  enabled: boolean;

  @Column()
  idleStateInterval: string;

  @Column()
  mobileStateInterval: string;

  @Column()
  active: boolean;

  @ManyToOne(() => Users, (user) => user.id)
  assignee: Users;

  @Column({ type: 'json' })
  meta: Meta;
}

export interface Meta {
  batteryPercentage: number;
  geofences: [{ name: string; geofence: any }];
  fields: [
    {
      name: string;
      value: string;
    },
  ];
}
