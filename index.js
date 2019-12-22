const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');

dotenv.config();

const PORT = process.env.PORT || 3000;
const USER = process.env.USER;
const PASS = process.env.PASS;

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
  secret: 'application_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(homeRoutes);
app.use(adminRoutes);

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${USER}:${PASS}@cluster0-kd796.mongodb.net/incom-auto`, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => {
      console.log('Server has been started')
    });
  } catch (e) {
    console.error(e)
  }
};

start();
