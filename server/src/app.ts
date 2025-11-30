import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import chatRoutes from './routes/chatRoutes';
import keywordRoutes from './routes/keywordRoutes';
import alertsRoutes from './routes/alertsRoutes';
import { uploadsDir } from './config/paths';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/keywords', keywordRoutes);
app.use('/api/alerts', alertsRoutes);

export default app;
