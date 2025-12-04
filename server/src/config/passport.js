const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { AppDataSource } = require('./data-source');
const { User } = require('../entities/User');

const userRepository = () => AppDataSource.getRepository(User);

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepository().findOne({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
