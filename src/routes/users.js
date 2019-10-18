const usersRouter = require('express').Router();
const userController = require('../controllers/users');
const authenticate = require('../middlewares/authenticate');

usersRouter.get('/users', userController.getAllUsers);
usersRouter.get('/users/:id', userController.getUserById);
usersRouter.post('/users', authenticate, userController.createUser);
usersRouter.delete('/users/:id', authenticate, userController.deleteUser);
usersRouter.patch('/users/:id', authenticate, userController.updateUser);
usersRouter.post('/users/login', userController.login);

module.exports = usersRouter;
