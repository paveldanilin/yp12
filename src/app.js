const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');

const logReq = require('./middlewares/logreq');
const auth = require('./middlewares/auth');
const resourceNotFound = require('./middlewares/resourcenotfound');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const loginRouter = require('./routes/login');

require('./db').init();

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(cors());
app.use(logReq);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(loginRouter);

app.use(auth);

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
