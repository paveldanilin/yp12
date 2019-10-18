const usersRouter = require('express').Router();
const userController = require('../controllers/users');

usersRouter.get('/users', userController.getAllUsers);
usersRouter.get('/users/:id', userController.getUserById);
usersRouter.post('/users', userController.createUser);
usersRouter.delete('/users/:id', userController.deleteUser);
usersRouter.patch('/users/me', userController.patchMe);
// usersRouter.patch('/users/:id', userController.updateUser);
usersRouter.patch('/users/me/avatar', userController.pathMeAvatar);
usersRouter.post('/users/login', userController.login);

module.exports = usersRouter;
