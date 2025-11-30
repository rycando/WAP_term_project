import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { BookImage } from './BookImage';
import { ChatRoom } from './ChatRoom';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.books, { eager: true })
  seller!: User;

  @Column()
  isbn!: string;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  publisher!: string;

  @Column()
  publishedAt!: string;

  @Column('decimal')
  price!: number;

  @Column('decimal', { nullable: true })
  listPrice!: number | null;

  @Column()
  condition!: string;

  @Column('text')
  description!: string;

  @Column({ nullable: true })
  mainImage!: string | null;

  @Column({ default: 'ON' })
  status!: string;

  @OneToMany(() => BookImage, (image) => image.book, { cascade: true })
  images!: BookImage[];

  @OneToMany(() => ChatRoom, (room) => room.book)
  chatRooms!: ChatRoom[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
