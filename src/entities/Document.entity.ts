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

export enum IdleStateIntervals {
  SIX_HOURS = 360,
}

export enum MobileStateIntervals {
  FIVE_MINUTES = 5,
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

  @Column({ default: IdleStateIntervals.SIX_HOURS })
  idleStateInterval: number;

  @Column({ default: MobileStateIntervals.FIVE_MINUTES })
  mobileStateInterval: number;

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
  batteryPercentage?: number;
  geofences?: [
    {
      id: string;
      name: string;
      geofence: Geofence[];
    },
  ];
  fields?: [
    {
      name: string;
      value: string;
    },
  ];
}

export interface Geofence {
  lat: number;
  lng: number;
}
