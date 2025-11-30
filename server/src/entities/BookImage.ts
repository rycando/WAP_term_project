import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Book } from './Book';

@Entity()
export class BookImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Book, (book) => book.images, { onDelete: 'CASCADE' })
  book!: Book;

  @Column()
  url!: string;
}
