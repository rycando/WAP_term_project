const { AppDataSource } = require('../config/data-source');
const { Keyword } = require('../entities/Keyword');
const { Book } = require('../entities/Book');

// 이 함수는 사용자의 키워드 목록을 반환한다.
const listKeywords = async (req, res) => {
  const user = req.user;
  try {
    const keywords = await AppDataSource.getRepository(Keyword).find({ where: { user: { id: user.id } } });
    return res.json(keywords);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching keywords', error: err });
  }
};

// 이 함수는 새로운 키워드를 추가한다.
const createKeyword = async (req, res) => {
  const user = req.user;
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
const deleteKeyword = async (req, res) => {
  const user = req.user;
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
const listAlerts = async (req, res) => {
  const user = req.user;
  const { since } = req.query;
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

module.exports = { listKeywords, createKeyword, deleteKeyword, listAlerts };
