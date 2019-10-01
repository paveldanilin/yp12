const path = require('path');
const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error', dirname: 'logs' }),
    new winston.transports.File({ filename: 'combined.log', dirname: 'logs' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const loggerMiddleware = (req, res, next) => {
  logger.log({ level: 'info', message: `[${req.method}] ${req.url} Headers: ${JSON.stringify(req.headers)}` });
  next();
};

const app = express();

app.use(loggerMiddleware);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
} else {
  app.use(express.static(path.join(__dirname, '../public')));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cardsRouter);
app.use(usersRouter);

app.use((req, res) => {
  logger.error(`Resource not found [${req.url}]`);
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  logger.log({ level: 'info', message: `App listening on port ${PORT}` });
});
