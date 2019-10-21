const UserModel = require('../models/user');
const logger = require('../logger');
const to = require('../utils/to');

function decodeUserErrors(errors) {
  return Object.keys(errors).map((key) => `Ошибка в поле [${key}]: ${errors[key].message}`);
}

async function usernameExists(name) {
  const [, user] = await to(UserModel.findOne({ name }));
  return Boolean(user);
}

async function getAllUsers(req, res) {
  const [err, users] = await to(UserModel.find({}, '-password -tokens'));

  if (!users) {
    logger.instance.error(`Could not get users. ${err}`);
    return res.status(500).send({ message: 'Ошибка получения списка пользователей' });
  }

  return res.send(users);
}

async function getUserById(req, res) {
  const [err, user] = await to(UserModel.findById(req.params.id, '-password -tokens'));

  if (!user) {
    logger.instance.error(`Could not get user with id ${req.params.id}. ${err}`);
    return res.status(404).send({ message: 'Ошибка при извлечении пользователя' });
  }

  return res.send(user);
}

async function createUser(req, res) {
  const isUserExists = await usernameExists(req.body.name);
  if (isUserExists) {
    return res.status(400).send({ message: 'Пользователь с таким именем уже существует' });
  }
  const [err, user] = await to(UserModel.create(req.body));
  if (!user) {
    logger.instance.error(`Could not create user. ${err}`);
    return res.status(500).send({
      message: 'Ошибка при создании пользователя',
      errors: decodeUserErrors(err.errors),
    });
  }
  const token = await user.createToken();
  return res.status(201).send({ user, token });
}

async function deleteUser(req, res) {
  const [, query] = await to(UserModel.findByIdAndRemove(req.params.id));
  if (!query) {
    logger.instance.error(`Could not delete unknown user with id ${req.param.id}`);
    return res.status(500).send({ message: 'Ошибка удаления пользователя' });
  }
  logger.instance.info(`User with id ${req.params.id} has been deleted`);
  return res.send({ message: 'Пользователь удален' });
}


async function updateUser(req, res) {
  const [, user] = await to(UserModel.findByIdAndUpdate(req.params.id, req.body));

  if (!user) {
    logger.instance.error(`Could not update unknown user with id ${req.params.id}`);
    return res.status(500).send({ message: 'Ошибка обновления пользователя' });
  }

  logger.instance.info(`User with id ${req.params.id} has been updated`);
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
    logger.instance.error(`Could not update unknown user with id ${req.user._id}.${err}`);
    return res.status(500).send({ message: 'Ошибка обновления пользователя' });
  }

  logger.instance.info(`User with id ${req.user._id} has been updated`);
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
    return res.status(404).send({ message: `Ошибка обновления пользователя. ${err}` });
  }

  return res.send(user);
}

async function login(req, res) {
  const { name, password } = req.body;
  let user = null;
  let token = null;

  try {
    user = await UserModel.loadUserByCredentials(name, password);
  } catch (e) {
    logger.instance.error(`Could not login user, ${e.toString()}`);
    return res.status(401).send({ message: 'Неизвестный пользователь' });
  }

  try {
    token = await user.createToken();
  } catch (e) {
    logger.instance.error('Could not create token');
    return res.status(500).send({ message: 'Ошибка генерации токена' });
  }

  return res.send({ user, token });
}

module.exports = {
  getAllUsers, getUserById, createUser, deleteUser, updateUser, login, patchMe, pathMeAvatar,
};
