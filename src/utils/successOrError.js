module.exports = (promise) => promise.then(() => true).catch((err) => err);
