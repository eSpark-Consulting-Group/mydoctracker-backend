import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './User.entity';
import { DeviceInventory } from './DeviceInventory.entity';

export enum DocumentType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => DeviceInventory, { cascade: true })
  @JoinColumn()
  tracker: DeviceInventory;

  @Column({ type: 'enum', enum: DocumentType })
  type: DocumentType;

  @Column()
  title: string;

  @Column()
  creationDate: Date;

  @Column()
  file: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: '6hr' })
  idleStateInterval: string;

  @Column({ default: '5m' })
  mobileStateInterval: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Users, (user) => user.id)
  assignee: Users;

  @Column({ type: 'json', default: null })
  meta: Meta;

  @Column({ default: false })
  isDeleted: boolean;
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
