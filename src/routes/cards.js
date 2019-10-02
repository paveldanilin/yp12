const cardsRouter = require('express').Router();
const logger = require('../logger');
const serializer = require('../serializer');
const FileCardProvider = require('../models/card/file-provider');

const userProvider = new FileCardProvider(serializer.instance);

const providerErrorHandler = (e, res) => {
  logger.instance.error(`Could not read cards data file. Reason: ${e.toString()}`);
  res.status(500).send({ error: e.toString() });
};

cardsRouter.get('/cards', (req, res) => {
  userProvider.load(
    (e) => providerErrorHandler(e, res),
    (cards) => res.send(serializer.instance.serialize(cards, 'Card')),
  );
});

module.exports = cardsRouter;
