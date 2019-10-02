const usersRouter = require('express').Router();
const logger = require('../logger');
const serializer = require('../serializer');
const FileUserProvider = require('../models/user/file-provider');

const userProvider = new FileUserProvider(serializer.instance);

const providerErrorHandler = (e, res) => {
  logger.instance.error(`Could not read users data file. Reason: ${e.toString()}`);
  res.status(500).send({ error: e.toString() });
};

usersRouter.get('/users', (req, res) => {
  userProvider.load(
    (e) => providerErrorHandler(e, res),
    (users) => res.send(serializer.instance.serialize(users, 'User')),
  );
});

usersRouter.get('/users/:id', (req, res) => {
  userProvider.load((e) => providerErrorHandler(e, res), (users) => {
    const foundUsers = users.findBy({ id: req.params.id });
    if (foundUsers.size() === 0) {
      logger.instance.warn(`User with id ${req.params.id} not found`);
      res.status(404).send({ message: 'Нет пользователя с таким id' });
    } else {
      res.status(200).send(serializer.instance.serialize(foundUsers.get(0), 'User'));
    }
  });
});

module.exports = usersRouter;
