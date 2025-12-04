require('reflect-metadata');
const { DataSource } = require('typeorm');
const { User } = require('../entities/User');
const { Book } = require('../entities/Book');
const { BookImage } = require('../entities/BookImage');
const { ChatRoom } = require('../entities/ChatRoom');
const { ChatMessage } = require('../entities/ChatMessage');
const { Keyword } = require('../entities/Keyword');
const { validateEnv } = require('../utils/validateEnv');

validateEnv();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Book, BookImage, ChatRoom, ChatMessage, Keyword],
  synchronize: true,
  logging: false,
});

const initializeDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};

module.exports = { AppDataSource, initializeDataSource };
