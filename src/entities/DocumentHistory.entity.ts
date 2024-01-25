import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Document, Meta } from './Document.entity';
import { DocumentType } from 'enum';

@Entity()
export class DocumentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DocumentType })
  type: DocumentType;

  @Column()
  title: string;

  @Column()
  creationDate: Date;

  @Column()
  file: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'json', default: null })
  meta: Meta;

  @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @Column()
  documentId: string;
}
