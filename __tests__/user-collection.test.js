const UserCollection = require('../src/models/user/collection');
const User = require('../src/models/user/user');

const testUserCollection = new UserCollection();

test('add users', () => {
  testUserCollection.add(User.create({ id: 1, name: 'Test1' })).add(User.create({ id: 2, name: 'Test2' }));
  expect(testUserCollection.size()).toBe(2);
});

test('find one', () => {
  const user = testUserCollection.findOneBy({ name: 'Test2' });
  expect(user).toBeInstanceOf(User);
});

test('find one null', () => {
  const user = testUserCollection.findOneBy({ name: 'UnknownUser' });
  expect(user).toBe(null);
});

test('get by index', () => {
  const user = testUserCollection.get(0);
  expect(user.getId()).toBe(1);
});
