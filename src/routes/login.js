const loginRouter = require('express').Router();
const userController = require('../controllers/users');
const schemaValidate = require('../middlewares/schema-validate');
const user = require('../models/user');

loginRouter.post('/signin', schemaValidate(user.getLoginSchema()), userController.login);
loginRouter.post('/signup', schemaValidate(user.getRegisterSchema()), userController.createUser);

module.exports = loginRouter;
