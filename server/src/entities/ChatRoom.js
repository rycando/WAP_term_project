const { EntitySchema } = require('typeorm');

const ChatRoom = new EntitySchema({
  name: 'ChatRoom',
  tableName: 'chat_room',
  columns: {
    id: { type: Number, primary: true, generated: true },
    status: { type: String, default: 'OPEN' },
    appointmentAt: { type: 'datetime', nullable: true },
    appointmentPlace: { type: 'varchar', length: 255, nullable: true },
    createdAt: { type: 'datetime', createDate: true },
    updatedAt: { type: 'datetime', updateDate: true },
  },
  relations: {
    book: { type: 'many-to-one', target: 'Book', inverseSide: 'chatRooms', eager: true, joinColumn: true },
    seller: { type: 'many-to-one', target: 'User', inverseSide: 'sellingRooms', eager: true, joinColumn: true },
    buyer: { type: 'many-to-one', target: 'User', inverseSide: 'buyingRooms', eager: true, joinColumn: true },
    messages: { type: 'one-to-many', target: 'ChatMessage', inverseSide: 'room' },
  },
});

module.exports = { ChatRoom };
