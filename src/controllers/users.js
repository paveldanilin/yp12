const UserModel = require('../models/user');
const logger = require('../logger');
const to = require('../utils/to');
const ServerError = require('../errors/server-error');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const NotAuthorized = require('../errors/not-authorized');

async function usernameExists(name) {
  const [, user] = await to(UserModel.findOne({ name }));
  return Boolean(user);
}

async function getAllUsers(req, res) {
  const [err, users] = await to(UserModel.find({}, '-password -tokens'));

  if (!users) {
    throw new ServerError('Ошибка получения списка пользователей', `Could not get users. ${err}`);
  }

  return res.send(users);
}

async function getUserById(req, res) {
  const [err, user] = await to(UserModel.findById(req.params.id, '-password -tokens'));

  if (!user) {
    throw new NotFound('Ошибка при извлечении пользователя', `Could not get user with id ${req.params.id}. ${err}`);
  }

  return res.send(user);
}

async function createUser(req, res) {
  const isUserExists = await usernameExists(req.body.name);
  if (isUserExists) {
    throw new BadRequest('Пользователь с таким именем уже существует');
  }

  const [err, user] = await to(UserModel.create(req.body));

  if (!user) {
    throw new ServerError('Ошибка при создании пользователя', `Could not create user. ${err}`);
  }

  try {
    const token = await user.createToken();
    return res.status(201).send({ token });
  } catch (e) {
    throw new ServerError('Ошибка создания токена', `Could not create token ${e}`);
  }
}

async function deleteUser(req, res) {
  const [, query] = await to(UserModel.findByIdAndRemove(req.params.id));
  if (!query) {
    throw new ServerError('Ошибка удаления пользователя', `Could not delete unknown user with id ${req.param.id}`);
  }
  logger.debugLogger.debug(`${req.requestId} - User with id ${req.params.id} has been deleted`);
  return res.send({ message: 'Пользователь удален' });
}

async function updateUser(req, res) {
  const [, user] = await to(UserModel.findByIdAndUpdate(req.params.id, req.body));

  if (!user) {
    throw new ServerError('Ошибка обновления пользователя', `Could not update unknown user with id ${req.params.id}`);
  }

  logger.debugLogger.debug(`${req.requestId} - User with id ${req.params.id} has been updated`);

  return res.send(user);
}

async function patchMe(req, res) {
  const [err, me] = await to(
    UserModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true },
    ),
  );

  if (!me) {
    throw new ServerError(
      'Ошибка обновления пользователя',
      `Could not update unknown user with id ${req.user._id}.${err}`,
    );
  }

  logger.debugLogger.debug(`${req.requestId} - User with id ${req.user._id} has been updated`);

  return res.send(me);
}

async function pathMeAvatar(req, res) {
  const [err, user] = await to(
    UserModel.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    ),
  );

  if (!user) {
    throw new ServerError(`Ошибка обновления пользователя. ${err}`);
  }

  return res.send(user);
}

async function login(req, res) {
  const { email, password } = req.body;
  let user = null;
  let token = null;

  try {
    user = await UserModel.loadUserByCredentials(email, password);
  } catch (e) {
    throw new NotAuthorized(
      'Пользователь не зарегистрирован или неверный пароль',
      `Could not login user, ${e.toString()}`,
    );
  }

  try {
    token = await user.createToken();
  } catch (e) {
    throw new ServerError('Ошибка генерации токена');
  }

  return res.send({ token });
}

module.exports = {
  getAllUsers, getUserById, createUser, deleteUser, login, patchMe, pathMeAvatar, updateUser,
};
