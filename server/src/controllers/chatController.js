const { AppDataSource } = require('../config/data-source');
const { ChatRoom } = require('../entities/ChatRoom');
const { ChatMessage } = require('../entities/ChatMessage');
const { Book } = require('../entities/Book');

// 이 함수는 채팅방을 생성하거나 기존 방을 반환한다.
const createRoom = async (req, res) => {
  const { bookId } = req.body;
  const user = req.user;
  try {
    const bookRepo = AppDataSource.getRepository(Book);
    const roomRepo = AppDataSource.getRepository(ChatRoom);
    const book = await bookRepo.findOne({ where: { id: bookId }, relations: ['seller'] });
    if (!book || book.status === 'DELETED')
      return res.status(404).json({ message: 'Book not found' });

    if (book.status === 'SOLD') {
      const soldRoom = await roomRepo.findOne({ where: { book: { id: bookId }, status: 'SOLD' }, relations: ['buyer'] });
      const isParticipant = soldRoom && (soldRoom.seller.id === user.id || soldRoom.buyer.id === user.id);
      if (!isParticipant) {
        return res.status(403).json({ message: 'Book is already sold' });
      }
      if (soldRoom) return res.status(201).json(soldRoom);
    }
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
const listRooms = async (req, res) => {
  const user = req.user;
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
const postMessage = async (req, res) => {
  const { roomId, message } = req.body;
  const user = req.user;
  try {
    const roomRepo = AppDataSource.getRepository(ChatRoom);
    const messageRepo = AppDataSource.getRepository(ChatMessage);
    const room = await roomRepo.findOne({ where: { id: roomId }, relations: ['seller', 'buyer'] });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.seller.id !== user.id && room.buyer.id !== user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const chatMessage = messageRepo.create({ room, sender: user, message });
    const saved = await messageRepo.save(chatMessage);
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: 'Error posting message', error: err });
  }
};

// 이 함수는 특정 채팅방의 메시지 목록을 반환한다.
const listMessages = async (req, res) => {
  const { roomId, after } = req.query;
  try {
    const room = await AppDataSource.getRepository(ChatRoom).findOne({ where: { id: roomId }, relations: ['seller', 'buyer'] });
    const user = req.user;
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.seller.id !== user.id && room.buyer.id !== user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

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

// 이 함수는 채팅방 약속 정보를 생성/수정한다.
const upsertAppointment = async (req, res) => {
  const { appointmentAt, appointmentPlace } = req.body;
  const roomId = Number(req.params.id ?? req.body.roomId);
  const user = req.user;
  try {
    if (!roomId) return res.status(400).json({ message: 'roomId is required' });
    const roomRepo = AppDataSource.getRepository(ChatRoom);
    const bookRepo = AppDataSource.getRepository(Book);
    const room = await roomRepo.findOne({ where: { id: roomId }, relations: ['seller', 'buyer', 'book'] });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.seller.id !== user.id) {
      return res.status(403).json({ message: 'Only the seller can manage appointments' });
    }

    let parsedDate = null;
    if (appointmentAt) {
      parsedDate = new Date(appointmentAt);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid appointmentAt' });
      }
    }

    const hasAppointment = !!(parsedDate || appointmentPlace);
    room.appointmentAt = parsedDate;
    room.appointmentPlace = appointmentPlace || null;
    room.status = hasAppointment ? 'SOLD' : 'OPEN';
    room.book.status = hasAppointment ? 'SOLD' : 'ON';
    await roomRepo.save(room);
    await bookRepo.save(room.book);

    const updated = await roomRepo.findOne({ where: { id: room.id }, relations: ['book', 'seller', 'buyer'] });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating appointment', error: err });
  }
};

module.exports = { createRoom, listRooms, postMessage, listMessages, upsertAppointment };
