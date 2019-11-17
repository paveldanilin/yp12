const usersRouter = require('express').Router();
const userController = require('../controllers/users');
const auth = require('../middlewares/auth');
const schemaValidate = require('../middlewares/schema-validate');
const user = require('../models/user');

usersRouter.get('/users', auth, userController.getAllUsers);
usersRouter.get('/users/:id', auth, userController.getUserById);
usersRouter.delete('/users/:id', auth, userController.deleteUser);
usersRouter.patch('/users/me', [auth, schemaValidate(user.getSchema())], userController.patchMe);
usersRouter.patch('/users/me/avatar', [auth, schemaValidate(user.getSchema())], userController.pathMeAvatar);

module.exports = usersRouter;
