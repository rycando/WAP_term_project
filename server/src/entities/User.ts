import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Book } from './Book';
import { ChatRoom } from './ChatRoom';
import { ChatMessage } from './ChatMessage';
import { Keyword } from './Keyword';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column()
  major!: string;

  @OneToMany(() => Book, (book) => book.seller)
  books!: Book[];

  @OneToMany(() => ChatRoom, (room) => room.seller)
  sellingRooms!: ChatRoom[];

  @OneToMany(() => ChatRoom, (room) => room.buyer)
  buyingRooms!: ChatRoom[];

  @OneToMany(() => ChatMessage, (message) => message.sender)
  messages!: ChatMessage[];

  @OneToMany(() => Keyword, (keyword) => keyword.user)
  keywords!: Keyword[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
