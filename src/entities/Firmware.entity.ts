import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Firmware {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'text', nullable: false })
  build: string;

  @Column()
  version: string;
  
  @Column({ type: 'json', default: null })
  meta: Record<string, unknown>;
}
