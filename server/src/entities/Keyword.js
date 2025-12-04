const { EntitySchema } = require('typeorm');

const Keyword = new EntitySchema({
  name: 'Keyword',
  tableName: 'keyword',
  columns: {
    id: { type: Number, primary: true, generated: true },
    keyword: { type: String },
    createdAt: { type: 'datetime', createDate: true },
    updatedAt: { type: 'datetime', updateDate: true },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'keywords',
      onDelete: 'CASCADE',
      joinColumn: true,
    },
  },
});

module.exports = { Keyword };
