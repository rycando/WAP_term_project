import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { ChatRoom } from '../entities/ChatRoom';
import { ChatMessage } from '../entities/ChatMessage';
import { Book } from '../entities/Book';
import { User } from '../entities/User';

// 이 함수는 채팅방을 생성하거나 기존 방을 반환한다.
export const createRoom = async (req: Request, res: Response) => {
  const { bookId } = req.body;
  const user = req.user as User;
  try {
    const bookRepo = AppDataSource.getRepository(Book);
    const roomRepo = AppDataSource.getRepository(ChatRoom);
    const book = await bookRepo.findOne({ where: { id: bookId }, relations: ['seller'] });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    let room = await roomRepo.findOne({ where: { book: { id: bookId }, buyer: { id: user.id } } });
    if (!room) {
      room = roomRepo.create({ book, seller: book.seller, buyer: user, status: 'OPEN' });
      room = await roomRepo.save(room);
    }
    return res.status(201).json(room);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating room', error: err });
  }
};

// 이 함수는 현재 사용자의 채팅방 목록을 반환한다.
export const listRooms = async (req: Request, res: Response) => {
  const user = req.user as User;
  try {
    const rooms = await AppDataSource.getRepository(ChatRoom).find({
      where: [{ seller: { id: user.id } }, { buyer: { id: user.id } }],
      relations: ['book', 'seller', 'buyer'],
      order: { updatedAt: 'DESC' },
    });
    return res.json(rooms);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching rooms', error: err });
  }
};

// 이 함수는 새로운 채팅 메시지를 저장한다.
export const postMessage = async (req: Request, res: Response) => {
  const { roomId, message } = req.body;
  const user = req.user as User;
  try {
    const roomRepo = AppDataSource.getRepository(ChatRoom);
    const messageRepo = AppDataSource.getRepository(ChatMessage);
    const room = await roomRepo.findOne({ where: { id: roomId } });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    const chatMessage = messageRepo.create({ room, sender: user, message });
    const saved = await messageRepo.save(chatMessage);
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: 'Error posting message', error: err });
  }
};

// 이 함수는 특정 채팅방의 메시지 목록을 반환한다.
export const listMessages = async (req: Request, res: Response) => {
  const { roomId, after } = req.query as any;
  try {
    const qb = AppDataSource.getRepository(ChatMessage)
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.roomId = :roomId', { roomId })
      .orderBy('message.createdAt', 'ASC');
    if (after) {
      qb.andWhere('message.createdAt > :after', { after });
    }
    const messages = await qb.getMany();
    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching messages', error: err });
  }
};
