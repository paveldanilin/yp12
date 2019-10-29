const loginRouter = require('express').Router();
const userController = require('../controllers/users');

loginRouter.post('/signin', userController.login);
loginRouter.post('/signup', userController.createUser);

module.exports = loginRouter;
