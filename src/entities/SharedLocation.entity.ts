import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Document } from './Document.entity';

@Entity()
export class SharedLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Document, (document) => document.id)
  documentId: Document;

  @Column()
  public: boolean;

  @Column({ type: 'simple-array' })
  users: number[];
}
