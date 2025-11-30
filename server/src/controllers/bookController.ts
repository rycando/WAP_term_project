import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Book } from '../entities/Book';
import { BookImage } from '../entities/BookImage';
import axios from 'axios';
import { User } from '../entities/User';

// 이 함수는 책 목록을 필터링하여 반환한다.
export const listBooks = async (req: Request, res: Response) => {
  const { keyword, major, status, page = 1, limit = 10 } = req.query as any;
  const repo = AppDataSource.getRepository(Book);
  try {
    const qb = repo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.seller', 'seller')
      .leftJoinAndSelect('book.images', 'images');

    if (keyword) {
      qb.andWhere('(book.title LIKE :kw OR book.description LIKE :kw)', { kw: `%${keyword}%` });
    }
    if (major) {
      qb.andWhere('seller.major = :major', { major });
    }
    if (status) {
      qb.andWhere('book.status = :status', { status });
    }
    qb.skip((+page - 1) * +limit).take(+limit).orderBy('book.createdAt', 'DESC');
    const [books, count] = await qb.getManyAndCount();
    return res.json({ data: books, total: count });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching books', error: err });
  }
};

// 이 함수는 특정 ID의 책 상세 정보를 반환한다.
export const getBook = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Book);
  try {
    const book = await repo.findOne({ where: { id: Number(req.params.id) }, relations: ['images', 'seller'] });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching book', error: err });
  }
};

// 이 함수는 새로운 책을 등록한다.
export const createBook = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Book);
  const imageRepo = AppDataSource.getRepository(BookImage);
  const user = req.user as User;
  try {
    const { isbn, title, author, publisher, publishedAt, price, condition, description, listPrice } = req.body;
    const book = repo.create({
      isbn,
      title,
      author,
      publisher,
      publishedAt,
      price: price ? Number(price) : 0,
      listPrice: listPrice ? Number(listPrice) : null,
      condition,
      description,
      seller: user,
      status: 'ON',
    });

    const savedBook = await repo.save(book);

    if (req.files && Array.isArray(req.files) && req.files.length) {
      const files = req.files as Express.Multer.File[];
      const images = await imageRepo.save(
        files.map((f) =>
          imageRepo.create({
            book: savedBook,
            url: f.filename ? `uploads/${f.filename}` : f.path.replace(/\\/g, '/'),
          })
        )
      );
      savedBook.images = images;
      savedBook.mainImage = (images[0]?.url ?? null) as any;
      await repo.save(savedBook);
    }

    return res.status(201).json(savedBook);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating book', error: err });
  }
};

// 이 함수는 책 정보를 수정한다.
export const updateBook = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Book);
  const imageRepo = AppDataSource.getRepository(BookImage);
  const user = req.user as User;
  try {
    const book = await repo.findOne({ where: { id: Number(req.params.id) }, relations: ['seller', 'images'] });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.id !== user.id) return res.status(403).json({ message: 'Forbidden' });
    const { isbn, title, author, publisher, publishedAt, price, condition, description, status, listPrice } = req.body;
    Object.assign(book, {
      isbn,
      title,
      author,
      publisher,
      publishedAt,
      price,
      condition,
      description,
      status,
      listPrice: listPrice ? Number(listPrice) : null,
    });

    if (req.files && Array.isArray(req.files) && req.files.length) {
      await imageRepo.delete({ book: { id: book.id } });
      const files = req.files as Express.Multer.File[];
      book.mainImage = files[0]
        ? files[0].filename
          ? `uploads/${files[0].filename}`
          : files[0].path.replace(/\\/g, '/')
        : book.mainImage;
      book.images = await imageRepo.save(
        files.map((f) =>
          imageRepo.create({
            book,
            url: f.filename ? `uploads/${f.filename}` : f.path.replace(/\\/g, '/'),
          })
        )
      );
    }
    const saved = await repo.save(book);
    return res.json(saved);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating book', error: err });
  }
};

// 이 함수는 책을 삭제하거나 비활성화한다.
export const deleteBook = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Book);
  const user = req.user as User;
  try {
    const book = await repo.findOne({ where: { id: Number(req.params.id) }, relations: ['seller'] });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.id !== user.id) return res.status(403).json({ message: 'Forbidden' });
    book.status = 'OFF';
    await repo.save(book);
    return res.json({ message: 'Book deactivated' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting book', error: err });
  }
};

// 이 함수는 ISBN으로 네이버 API를 조회한다.
export const searchByIsbn = async (req: Request, res: Response) => {
  const { isbn } = req.params;
  try {
    const headers = {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
    };

    const callSearch = async (params: Record<string, string>) => {
      const response = await axios.get('https://openapi.naver.com/v1/search/book.json', { params, headers });
      return response.data.items?.[0] ?? null;
    };

    const isbnResult = await callSearch({ d_isbn: isbn });
    const needsFallback = !isbnResult?.price;
    const queryResult = needsFallback ? await callSearch({ query: isbn }) : null;

    const item = isbnResult || queryResult;
    if (!item && !queryResult) return res.status(404).json({ message: 'Not found' });

    const source = item?.price ? item : queryResult || isbnResult;
    const normalized = {
      title: source?.title?.replace(/<[^>]*>/g, ''),
      author: source?.author,
      publisher: source?.publisher,
      publishedAt: source?.pubdate,
      image: source?.image,
      listPrice: source?.price ? Number(source.price) : null,
    };
    return res.json(normalized);
  } catch (err) {
    return res.status(500).json({ message: 'Error calling Naver API', error: err });
  }
};
