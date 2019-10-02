const express = require('express');
const bodyParser = require('body-parser');
const utils = require('./utils');
const logger = require('./logger');
const { loggerMiddleware, routeNotFoundMiddleware } = require('./middlewares');

const { PORT = 3000 } = process.env;
const app = express();

app.use(loggerMiddleware);
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
