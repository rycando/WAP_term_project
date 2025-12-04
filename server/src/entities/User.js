const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: 'User',
  tableName: 'user',
  columns: {
    id: { type: Number, primary: true, generated: true },
    email: { type: String, unique: true },
    password: { type: String },
    name: { type: String },
    major: { type: String },
    createdAt: { type: 'datetime', createDate: true },
    updatedAt: { type: 'datetime', updateDate: true },
  },
  relations: {
    books: { type: 'one-to-many', target: 'Book', inverseSide: 'seller' },
    sellingRooms: { type: 'one-to-many', target: 'ChatRoom', inverseSide: 'seller' },
    buyingRooms: { type: 'one-to-many', target: 'ChatRoom', inverseSide: 'buyer' },
    messages: { type: 'one-to-many', target: 'ChatMessage', inverseSide: 'sender' },
    keywords: { type: 'one-to-many', target: 'Keyword', inverseSide: 'user' },
  },
});

module.exports = { User };
