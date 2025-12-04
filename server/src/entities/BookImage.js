const { EntitySchema } = require('typeorm');

const BookImage = new EntitySchema({
  name: 'BookImage',
  tableName: 'book_image',
  columns: {
    id: { type: Number, primary: true, generated: true },
    url: { type: String },
  },
  relations: {
    book: {
      type: 'many-to-one',
      target: 'Book',
      inverseSide: 'images',
      onDelete: 'CASCADE',
      joinColumn: true,
    },
  },
});

module.exports = { BookImage };
