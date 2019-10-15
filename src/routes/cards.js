const cardsRouter = require('express').Router();
const cardController = require('../controllers/cards');
const { authenticate } = require('../middlewares/middlewares');

cardsRouter.get('/cards', cardController.getAll);
cardsRouter.get('/cards/:id', cardController.getById);
cardsRouter.post('/cards', authenticate, cardController.create);
cardsRouter.delete('/cards/:id', authenticate, cardController.delete);
cardsRouter.patch('/cards/:id', authenticate, cardController.update);
cardsRouter.put('/cards/:id/likes', authenticate, cardController.like);
cardsRouter.delete('/cards/:id/likes', authenticate, cardController.dislike);

module.exports = cardsRouter;
