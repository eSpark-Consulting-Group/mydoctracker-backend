import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Document, DocumentType, Meta } from './Document.entity';

@Entity()
export class DocumentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: DocumentType })
  type: DocumentType;

  @Column()
  title: string;

  @Column()
  creationDate: Date;

  @Column()
  file: string;

  @Column({ type: 'json' })
  meta: Meta;

  @ManyToOne(() => Document, (document) => document.id)
  documentId: Document;
}
