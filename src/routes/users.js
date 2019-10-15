const usersRouter = require('express').Router();
const userController = require('../controllers/users');

usersRouter.get('/users', userController.getAll);
usersRouter.get('/users/:id', userController.getById);
usersRouter.post('/users', userController.create);
usersRouter.delete('/users/:id', userController.delete);
usersRouter.patch('/users/:id', userController.update);

module.exports = usersRouter;
