const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const nunjucks = require('nunjucks');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const chatRoutes = require('./routes/chatRoutes');
const keywordRoutes = require('./routes/keywordRoutes');
const alertsRoutes = require('./routes/alertsRoutes');
const viewRoutes = require('./routes/viewRoutes');
const { uploadsDir } = require('./config/paths');

const app = express();

// Nunjucks setup for server-rendered pages
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');
const nunjucksEnv = nunjucks.configure(app.get('views'), {
  autoescape: true,
  express: app,
});
nunjucksEnv.addFilter('json', (value) => JSON.stringify(value ?? null));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Make user available to templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Static assets (CSS/JS)
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/keywords', keywordRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/', viewRoutes);

module.exports = app;
