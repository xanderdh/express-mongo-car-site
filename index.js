const express = require('express');
const mongoose = require('mongoose');
const homeRoutes = require('./routes/home');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;
const USER = process.env.USER;
const PASS = process.env.PASS;

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(homeRoutes);
app.use(express.static(path.join(__dirname, 'public')));

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
