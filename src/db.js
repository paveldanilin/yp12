const mongoose = require('mongoose');
const logger = require('./logger');

module.exports.init = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_MESTODB_URL,
      {
        useNewUrlParser: true, useUnifiedTopology: true,
      },
    );
    await mongoose.set('useFindAndModify', false);
  } catch (error) {
    logger.instance.error(error);
  }
};
