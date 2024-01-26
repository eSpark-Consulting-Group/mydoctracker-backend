import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Firmware {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  build: string;

  @Column({ unique: true })
  version: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'json', default: null })
  meta: Record<string, unknown>;
}
