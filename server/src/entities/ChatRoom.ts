import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './Book';
import { User } from './User';
import { ChatMessage } from './ChatMessage';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Book, (book) => book.chatRooms, { eager: true })
  book!: Book;

  @ManyToOne(() => User, (user) => user.sellingRooms, { eager: true })
  seller!: User;

  @ManyToOne(() => User, (user) => user.buyingRooms, { eager: true })
  buyer!: User;

  @Column({ default: 'OPEN' })
  status!: string;

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages!: ChatMessage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
