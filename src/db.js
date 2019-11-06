const mongoose = require('mongoose');
const config = require('./config');
const ServerError = require('./errors/server-error');

module.exports.init = async () => {
  try {
    await mongoose.connect(
      config.MONGODB_MESTODB_URL,
      {
        useNewUrlParser: true, useUnifiedTopology: true,
      },
    );
    await mongoose.set('useFindAndModify', false);
  } catch (error) {
    throw new ServerError('Ошибка соединения с базой', error);
  }
};
