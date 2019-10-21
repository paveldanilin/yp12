const cardsRouter = require('express').Router();
const cardController = require('../controllers/cards');

cardsRouter.get('/cards', cardController.getAllCards);
cardsRouter.get('/cards/:id', cardController.getCardById);
cardsRouter.post('/cards', cardController.createCard);
cardsRouter.delete('/cards/:id', cardController.deleteCard);
cardsRouter.patch('/cards/:id', cardController.updateCard);
cardsRouter.put('/cards/:id/likes', cardController.like);
cardsRouter.delete('/cards/:id/likes', cardController.dislike);

module.exports = cardsRouter;
