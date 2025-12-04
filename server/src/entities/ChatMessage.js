const { EntitySchema } = require('typeorm');

const ChatMessage = new EntitySchema({
  name: 'ChatMessage',
  tableName: 'chat_message',
  columns: {
    id: { type: Number, primary: true, generated: true },
    message: { type: 'text' },
    createdAt: { type: 'datetime', createDate: true },
    updatedAt: { type: 'datetime', updateDate: true },
  },
  relations: {
    room: {
      type: 'many-to-one',
      target: 'ChatRoom',
      inverseSide: 'messages',
      onDelete: 'CASCADE',
      joinColumn: true,
    },
    sender: { type: 'many-to-one', target: 'User', inverseSide: 'messages', eager: true, joinColumn: true },
  },
});

module.exports = { ChatMessage };
