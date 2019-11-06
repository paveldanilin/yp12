const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const expressWinston = require('express-winston');
const winston = require('winston'); // for transports.Console

const logger = require('./logger');
const config = require('./config');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const loginRouter = require('./routes/login');
const resourceNotFound = require('./middlewares/resource-not-found');
const requestId = require('./middlewares/request-id');

require('./db').init();

const app = express();

app.use(requestId);
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log', dirname: 'logs' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  requestWhitelist: ['requestId', 'url', 'headers', 'method', 'httpVersion', 'originalUrl', 'query'],
}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(loginRouter);
app.use(cardRoutes);
app.use(userRoutes);

app.use('*', resourceNotFound);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Ошибка сервера' } = err;
  let msg = `${req.requestId} - ${message}`;
  if (err.debug) {
    msg += ` - ${err.debug}`;
  }
  logger.errorLogger.error(msg);
  res.status(statusCode).send({ message });
});

app.listen(config.SERVER_PORT, () => {
  logger.requestLogger.info(`App listening on port ${config.SERVER_PORT}`);
});
