const cardsRouter = require('express').Router();
const cardController = require('../controllers/cards');
const authenticate = require('../middlewares/authenticate');

cardsRouter.get('/cards', cardController.getAllCards);
cardsRouter.get('/cards/:id', cardController.getCardById);
cardsRouter.post('/cards', authenticate, cardController.createCard);
cardsRouter.delete('/cards/:id', authenticate, cardController.deleteCard);
cardsRouter.patch('/cards/:id', authenticate, cardController.updateCard);
cardsRouter.put('/cards/:id/likes', authenticate, cardController.like);
cardsRouter.delete('/cards/:id/likes', authenticate, cardController.dislike);

module.exports = cardsRouter;
