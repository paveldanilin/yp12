const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const logReq = require('./middlewares/logreq');
const resourceNotFound = require('./middlewares/resourcenotfound');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

require('./db').init();

const { PORT = 3000, TEST_USER_ID = null } = process.env;
const app = express();

app.use(helmet());
app.use(cors());
app.use(logReq);

// вставьте сюда _id созданного в предыдущем пункте пользователя
app.use((req, res, next) => {
  const yourTestUserId = '';
  req.user = {
    _id: TEST_USER_ID || yourTestUserId,
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cardRoutes);
app.use(userRoutes);
app.use(resourceNotFound);

app.listen(PORT, () => {
  const startupMsg = {
    level: 'info',
    message: `App listening on port ${PORT}`,
  };
  logger.instance.log(startupMsg);
});
