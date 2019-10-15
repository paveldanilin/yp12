const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const utils = require('./utils/utils');
const { authenticate, loggerMiddleware, routeNotFoundMiddleware } = require('./middlewares');

async function initDb() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.set('useFindAndModify', false);
  } catch (error) {
    logger.instance.error(error);
  }
}

initDb();

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(cors());
app.use(loggerMiddleware);
app.use(authenticate);
app.use(express.static(utils.getPublicPath()));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./routes/cards'));
app.use(require('./routes/users'));

app.use(routeNotFoundMiddleware);

app.listen(PORT, () => {
  const startupMsg = {
    level: 'info',
    message: `App listening on port ${PORT}`,
  };
  logger.instance.log(startupMsg);
});
