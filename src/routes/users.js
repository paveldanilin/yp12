const usersRouter = require('express').Router();
const userController = require('../controllers/users');
const { authenticate } = require('../middlewares/middlewares');

usersRouter.get('/users', userController.getAll);
usersRouter.get('/users/:id', userController.getById);
usersRouter.post('/users', authenticate, userController.create);
usersRouter.delete('/users/:id', authenticate, userController.delete);
usersRouter.patch('/users/:id', authenticate, userController.update);
usersRouter.post('/users/login', userController.login);

module.exports = usersRouter;
