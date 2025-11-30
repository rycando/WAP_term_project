import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Keyword } from '../entities/Keyword';
import { Book } from '../entities/Book';
import { User } from '../entities/User';

// 이 함수는 사용자의 키워드 목록을 반환한다.
export const listKeywords = async (req: Request, res: Response) => {
  const user = req.user as User;
  try {
    const keywords = await AppDataSource.getRepository(Keyword).find({ where: { user: { id: user.id } } });
    return res.json(keywords);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching keywords', error: err });
  }
};

// 이 함수는 새로운 키워드를 추가한다.
export const createKeyword = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { keyword } = req.body;
  try {
    const repo = AppDataSource.getRepository(Keyword);
    const entity = repo.create({ keyword, user });
    const saved = await repo.save(entity);
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating keyword', error: err });
  }
};

// 이 함수는 키워드를 삭제한다.
export const deleteKeyword = async (req: Request, res: Response) => {
  const user = req.user as User;
  try {
    const repo = AppDataSource.getRepository(Keyword);
    const keyword = await repo.findOne({ where: { id: Number(req.params.id), user: { id: user.id } } });
    if (!keyword) return res.status(404).json({ message: 'Keyword not found' });
    await repo.delete(keyword.id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting keyword', error: err });
  }
};

// 이 함수는 키워드 알림에 맞는 책을 반환한다.
export const listAlerts = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { since } = req.query as any;
  try {
    const keywords = await AppDataSource.getRepository(Keyword).find({ where: { user: { id: user.id } } });
    const keywordValues = keywords.map((k) => k.keyword);
    if (!keywordValues.length) return res.json([]);
    const qb = AppDataSource.getRepository(Book)
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.seller', 'seller')
      .where(
        keywordValues
          .map((_, idx) => `(book.title LIKE :kw${idx} OR book.description LIKE :kw${idx})`)
          .join(' OR '),
        Object.fromEntries(keywordValues.map((kw, idx) => [`kw${idx}`, `%${kw}%`]))
      );
    if (since) {
      qb.andWhere('book.createdAt > :since', { since });
    }
    const books = await qb.getMany();
    return res.json(books);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching alerts', error: err });
  }
};
