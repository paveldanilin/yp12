const usersRouter = require('express').Router();
const userController = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRouter.get('/users', auth, userController.getAllUsers);
usersRouter.get('/users/:id', auth, userController.getUserById);
usersRouter.delete('/users/:id', auth, userController.deleteUser);
usersRouter.patch('/users/me', auth, userController.patchMe);
usersRouter.patch('/users/me/avatar', auth, userController.pathMeAvatar);

module.exports = usersRouter;
