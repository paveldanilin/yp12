const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const logger = require('./logger');
const { loggerMiddleware, routeNotFoundMiddleware } = require('./middlewares/middlewares');

db.init();

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(cors());
app.use(loggerMiddleware);
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
