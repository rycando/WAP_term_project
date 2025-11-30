import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { User } from '../entities/User';

type Done = (error: any, user?: any, options?: { message: string }) => void;

const userRepository = () => AppDataSource.getRepository(User);

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done: Done) => {
    try {
      const user = await userRepository().findOne({ where: { email } });
      if (!user) {
        return done(null, false, { message: '아이디와 비밀번호를 확인해주세요.' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: '아이디와 비밀번호를 확인해주세요.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await userRepository().findOne({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err as any);
  }
});

export default passport;
