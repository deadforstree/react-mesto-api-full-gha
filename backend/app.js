const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { routes } = require('./routes');
const {
  login,
  createUser,
} = require('./controllers/user');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  signUpValidation,
  signInValidation,
} = require('./middlewares/validations');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

async function main() {
  // подключаемся к серверу mongo
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.use(requestLogger); // подключаем логгер запросов

  app.get('/crash-test', () => {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  });

  // роуты, не требующие авторизации - регистрация и логин
  app.post('/signup', express.json(), signUpValidation, createUser);
  app.post('/signin', express.json(), signInValidation, login);

  // авторизация
  app.use(auth);

  // роуты, которым авторизация нужна
  app.use(routes);

  app.use(errorLogger); // подключаем логгер ошибок

  // обработчик ошибок celebrate
  app.use(errors());

  // централизованная обработка ошибок
  app.use((err, req, res, next) => {
    // если у ошибки нет статуса, выставляем 500
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        // проверяем статус и выставляем сообщение в зависимости от него
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
    next();
  });

  await app.listen(PORT);
}

main();
