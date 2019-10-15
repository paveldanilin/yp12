const cardsRouter = require('express').Router();
const cardController = require('../controllers/cards');

cardsRouter.get('/cards', cardController.getAll);
cardsRouter.get('/cards/:id', cardController.getById);
cardsRouter.post('/cards', cardController.create);
cardsRouter.delete('/cards/:id', cardController.delete);
cardsRouter.patch('/cards/:id', cardController.update);

module.exports = cardsRouter;
