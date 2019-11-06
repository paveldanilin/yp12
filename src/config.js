const dotenv = require('dotenv');

dotenv.config();

/*
if (result.error) {
  throw result.error;
}
 */

module.exports = {
  SERVER_PORT: process.env.PORT || 3000,
  MONGODB_MESTODB_URL: process.env.MONGODB_MESTODB_URL || 'mongodb://localhost:27017/mestodb',
  JWT_SECRET: process.env.JWT_SECRET || '123456',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
};
