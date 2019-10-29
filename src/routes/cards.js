const cardsRouter = require('express').Router();
const cardController = require('../controllers/cards');
const auth = require('../middlewares/auth');

cardsRouter.get('/cards', auth, cardController.getAllCards);
cardsRouter.get('/cards/:id', auth, cardController.getCardById);
cardsRouter.post('/cards', auth, cardController.createCard);
cardsRouter.delete('/cards/:id', auth, cardController.deleteCard);
cardsRouter.patch('/cards/:id', auth, cardController.updateCard);
cardsRouter.put('/cards/:id/likes', auth, cardController.like);
cardsRouter.delete('/cards/:id/likes', auth, cardController.dislike);

module.exports = cardsRouter;
