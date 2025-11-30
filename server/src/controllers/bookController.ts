import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Book } from '../entities/Book';
import { BookImage } from '../entities/BookImage';
import axios from 'axios';
import { User } from '../entities/User';

// 책 목록 조회 (필터 + 페이징)
export const listBooks = async (req: Request, res: Response) => {
  const { keyword, major, status, page = 1, limit = 10 } = req.query as any;
  const repo = AppDataSource.getRepository(Book);

  try {
    const qb = repo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.seller', 'seller')
      .leftJoinAndSelect('book.images', 'images');

    if (keyword) {
      qb.andWhere('(book.title LIKE :kw OR book.description LIKE :kw)', {
        kw: `%${keyword}%`,
      });
    }

    if (major) {
      qb.andWhere('seller.major = :major', { major });
    }

    if (status) {
      qb.andWhere('book.status = :status', { status });
    }

    qb.skip((+page - 1) * +limit)
      .take(+limit)
      .orderBy('book.createdAt', 'DESC');

    const [books, count] = await qb.getManyAndCount();

    return res.json({ data: books, total: count });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching books', error: err });
  }
};

// 단일 책 조회
export const getBook = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Book);

  try {
    const book = await repo.findOne({
      where: { id: Number(req.params.id) },
      relations: ['images', 'seller'],
    });

    if (!book) return res.status(404).json({ message: 'Book not found' });

    return res.json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching book', error: err });
  }
};

// 책 등록
export const createBook = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Book);
  const imageRepo = AppDataSource.getRepository(BookImage);
  const user = req.user as User;

  try {
    const {
      isbn,
      title,
      author,
      publisher,
      publishedAt,
      price,
      condition,
      description,
      listPrice,
    } = req.body;

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

    // 이미지 저장
    if (req.files && Array.isArray(req.files) && req.files.length) {
      const files = req.files as Express.Multer.File[];

      const images = await imageRepo.save(
        files.map((f) =>
          imageRepo.create({
            book: savedBook,
            url: f.path.replace(/\\/g, '/'),
          })
        )
      );

      savedBook.images = images;
      savedBook.mainImage = images[0]?.url ?? null;

      await repo.save(savedBook);
    }

    return res.status(201).json(savedBook);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating book', error: err });
  }
};

// 책 수정
export const updateBook = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Book);
  const imageRepo = AppDataSource.getRepository(BookImage);
  const user = req.user as User;

  try {
    const book = await repo.findOne({
      where: { id: Number(req.params.id) },
      relations: ['seller', 'images'],
    });

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.id !== user.id)
      return res.status(403).json({ message: 'Forbidden' });

    const {
      isbn,
      title,
      author,
      publisher,
      publishedAt,
      price,
      condition,
      description,
      status,
      listPrice,
    } = req.body;

    Object.assign(book, {
      isbn,
      title,
      author,
      publisher,
      publishedAt,
      price: price ? Number(price) : 0,
      condition,
      description,
      status,
      listPrice: listPrice ? Number(listPrice) : null,
    });

    // 이미지 교체
    if (req.files && Array.isArray(req.files) && req.files.length) {
      await imageRepo.delete({ book: { id: book.id } });

      const files = req.files as Express.Multer.File[];

      const images = await imageRepo.save(
        files.map((f) =>
          imageRepo.create({
            book,
            url: f.path.replace(/\\/g, '/'),
          })
        )
      );

      book.images = images;
      book.mainImage = images[0]?.url ?? book.mainImage;
    }

    const saved = await repo.save(book);
    return res.json(saved);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating book', error: err });
  }
};

// 책 비활성화
export const deleteBook = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Book);
  const user = req.user as User;

  try {
    const book = await repo.findOne({
      where: { id: Number(req.params.id) },
      relations: ['seller'],
    });

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.id !== user.id)
      return res.status(403).json({ message: 'Forbidden' });

    book.status = 'OFF';
    await repo.save(book);

    return res.json({ message: 'Book deactivated' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting book', error: err });
  }
};

// ISBN 검색
export const searchByIsbn = async (req: Request, res: Response) => {
  const { isbn } = req.params;

  try {
    const response = await axios.get(
      'https://openapi.naver.com/v1/search/book.json',
      {
        params: { query: isbn, d_isbn: isbn },
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
        },
      }
    );

    const item = response.data.items?.[0];

    if (!item) return res.status(404).json({ message: 'Not found' });

    const normalized = {
      title: item.title?.replace(/<[^>]*>/g, ''),
      author: item.author,
      publisher: item.publisher,
      publishedAt: item.pubdate,
      image: item.image,
      listPrice: item.price ? Number(item.price) : null,
    };

    return res.json(normalized);
  } catch (err) {
    return res.status(500).json({ message: 'Error calling Naver API', error: err });
  }
};
