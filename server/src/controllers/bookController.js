const { AppDataSource } = require('../config/data-source');
const { Book } = require('../entities/Book');
const { BookImage } = require('../entities/BookImage');
const axios = require('axios');
const { normalizeUploadPath } = require('../utils/uploads');

/* -----------------------------
 *  책 목록 조회 (필터 + 페이징)
 * ----------------------------- */
const listBooks = async (req, res) => {
  const { keyword, major, status, page = 1, limit = 10 } = req.query;
  const repo = AppDataSource.getRepository(Book);

  try {
    const qb = repo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.seller', 'seller')
      .leftJoinAndSelect('book.images', 'images')
      .andWhere('book.status != :deleted', { deleted: 'DELETED' });

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

    // 이미지 경로 정규화
    const normalizedBooks = books.map((book) => {
      const { password: _pw, ...sellerSafe } = book.seller || {};

      return {
        ...book,
        seller: sellerSafe,
        mainImage: normalizeUploadPath(book.mainImage),
        images:
          book.images?.map((img) => ({
            ...img,
            url: normalizeUploadPath(img.url),
          })) ?? [],
      };
    });

    return res.json({ data: normalizedBooks, total: count });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching books', error: err });
  }
};

/* -----------------------------
 *  단일 책 조회
 * ----------------------------- */
const getBook = async (req, res) => {
  const repo = AppDataSource.getRepository(Book);

  try {
    const book = await repo.findOne({
      where: { id: Number(req.params.id) },
      relations: ['images', 'seller'],
    });

    if (!book || book.status === 'DELETED')
      return res.status(404).json({ message: 'Book not found' });

    const { password: _pw, ...sellerSafe } = book.seller || {};

    // 경로 정규화
    book.mainImage = normalizeUploadPath(book.mainImage);
    book.images =
      book.images?.map((img) => ({
        ...img,
        url: normalizeUploadPath(img.url),
      })) || [];

    return res.json({ ...book, seller: sellerSafe });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching book', error: err });
  }
};

/* -----------------------------
 *  책 등록
 * ----------------------------- */
const createBook = async (req, res) => {
  const repo = AppDataSource.getRepository(Book);
  const imageRepo = AppDataSource.getRepository(BookImage);
  const user = req.user;

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
      const files = req.files;

      const images = await imageRepo.save(
        files.map((f) =>
          imageRepo.create({
            book: savedBook,
            url: normalizeUploadPath(
              f.filename ? `uploads/${f.filename}` : f.path
            ),
          })
        )
      );

      savedBook.images = images;
      savedBook.mainImage = normalizeUploadPath(images[0]?.url);
      await repo.save(savedBook);
    }

    return res.status(201).json(savedBook);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating book', error: err });
  }
};

/* -----------------------------
 *  책 수정
 * ----------------------------- */
const updateBook = async (req, res) => {
  const repo = AppDataSource.getRepository(Book);
  const imageRepo = AppDataSource.getRepository(BookImage);
  const user = req.user;

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

      const files = req.files;

      const newImages = await imageRepo.save(
        files.map((f) =>
          imageRepo.create({
            book,
            url: normalizeUploadPath(
              f.filename ? `uploads/${f.filename}` : f.path
            ),
          })
        )
      );

      book.images = newImages;
      book.mainImage = normalizeUploadPath(newImages[0]?.url);
    }

    const saved = await repo.save(book);
    return res.json(saved);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating book', error: err });
  }
};

/* -----------------------------
 *  책 비활성화
 * ----------------------------- */
const deleteBook = async (req, res) => {
  const repo = AppDataSource.getRepository(Book);
  const user = req.user;

  try {
    const book = await repo.findOne({
      where: { id: Number(req.params.id) },
      relations: ['seller'],
    });

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.id !== user.id)
      return res.status(403).json({ message: 'Forbidden' });

    book.status = 'DELETED';
    await repo.save(book);

    return res.json({ message: 'Book removed' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting book', error: err });
  }
};

/* -----------------------------
 *  ISBN 검색 (네이버 API)
 * ----------------------------- */
const searchByIsbn = async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get('https://openapi.naver.com/v1/search/book.json', {
      params: { query: isbn, d_isbn: isbn },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
      },
    });
    const item = response.data.items?.[0];
    if (!item) return res.status(404).json({ message: 'Not found' });
    const listPrice =
      item.price && Number(item.price) > 0
        ? Number(item.price)
        : item.discount && Number(item.discount) > 0
        ? Number(item.discount)
        : null;

    const normalized = {
      title: item.title?.replace(/<[^>]*>/g, ''),
      author: item.author,
      publisher: item.publisher,
      publishedAt: item.pubdate,
      image: item.image,
      listPrice: item.price ? Number(item.price) : (item.discount ? Number(item.discount) : null),
    };
    return res.json(normalized);
  } catch (err) {
    return res.status(500).json({ message: 'Error calling Naver API', error: err });
  }
};

module.exports = {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchByIsbn,
};
