import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

// 이 함수는 새로운 사용자를 회원가입 처리한다.
export const register = async (req: Request, res: Response) => {
  const { email, password, name, major } = req.body;
  try {
    const repo = AppDataSource.getRepository(User);
    const existing = await repo.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = repo.create({ email, password: hashed, name, major });
    const saved = await repo.save(user);
    const { password: _, ...userData } = saved;
    return res.status(201).json(userData);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

// 이 함수는 사용자를 로그인 처리한다.
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: User, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info?.message || 'Login failed' });
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      const { password, ...userData } = user;
      return res.json(userData);
    });
  })(req, res, next);
};

// 이 함수는 현재 로그인한 사용자를 반환한다.
export const me = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user = req.user as User;
    const { password, ...userData } = user;
    return res.json(userData);
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

// 이 함수는 사용자를 로그아웃 처리한다.
export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.json({ message: 'Logged out' });
    });
  });
};
