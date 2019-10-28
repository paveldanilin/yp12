const usersRouter = require('express').Router();
const userController = require('../controllers/users');

usersRouter.get('/users', userController.getAllUsers);
usersRouter.get('/users/:id', userController.getUserById);
usersRouter.delete('/users/:id', userController.deleteUser);
usersRouter.patch('/users/me', userController.patchMe);
usersRouter.patch('/users/me/avatar', userController.pathMeAvatar);

module.exports = usersRouter;
