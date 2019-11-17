const cardsRouter = require('express').Router();
const cardController = require('../controllers/cards');
const auth = require('../middlewares/auth');
const schemaValidate = require('../middlewares/schema-validate');
const card = require('../models/card');

cardsRouter.get('/cards', auth, cardController.getAllCards);
cardsRouter.get('/cards/:id', auth, cardController.getCardById);
cardsRouter.post('/cards', [auth, schemaValidate(card.getCreateSchema())], cardController.createCard);
cardsRouter.delete('/cards/:id', auth, cardController.deleteCard);
cardsRouter.patch('/cards/:id', [auth, schemaValidate(card.getSchema())], cardController.updateCard);
cardsRouter.put('/cards/:id/likes', auth, cardController.like);
cardsRouter.delete('/cards/:id/likes', auth, cardController.dislike);

module.exports = cardsRouter;
