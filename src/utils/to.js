/*
[err, user] = await to(UserModel.findById(1));
*/

module.exports = (promise) => promise.then((data) => [null, data]).catch((err) => [err]);
