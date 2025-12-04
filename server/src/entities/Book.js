const { EntitySchema } = require('typeorm');

const Book = new EntitySchema({
  name: 'Book',
  tableName: 'book',
  columns: {
    id: { type: Number, primary: true, generated: true },
    isbn: { type: String },
    title: { type: String },
    author: { type: String },
    publisher: { type: String },
    publishedAt: { type: String },
    price: { type: 'decimal' },
    listPrice: { type: 'decimal', nullable: true },
    condition: { type: String },
    description: { type: 'text' },
    mainImage: { type: 'varchar', nullable: true },
    status: { type: String, default: 'ON' },
    createdAt: { type: 'datetime', createDate: true },
    updatedAt: { type: 'datetime', updateDate: true },
  },
  relations: {
    seller: { type: 'many-to-one', target: 'User', inverseSide: 'books', eager: true, joinColumn: true },
    images: { type: 'one-to-many', target: 'BookImage', inverseSide: 'book', cascade: true },
    chatRooms: { type: 'one-to-many', target: 'ChatRoom', inverseSide: 'book' },
  },
});

module.exports = { Book };
