const usersRouter = require('express').Router();
const fs = require('fs');
const path = require('path');

function getUsersData() {
  let filePath = path.resolve(`${__dirname }/../../data/users.json`);
  if (process.env.NODE_ENV === 'production') {
    filePath = './data/users.json';
  }
  return JSON.parse(fs.readFileSync(filePath));
}

usersRouter.get('/users', (req, res) => {

  res.send(getUsersData());
});

usersRouter.get('/users/:id', (req, res) => {
  const uid = req.params.id;

  const usersCollection = getUsersData();

  // eslint-disable-next-line no-underscore-dangle,no-shadow,array-callback-return
  const user = usersCollection.filter((user) => user._id === uid);

  if (user.length === 0) {
    res.status(404).send({ message: 'Нет пользователя с таким id' });
  } else {
    res.send(user[0]);
  }
});

module.exports = usersRouter;
