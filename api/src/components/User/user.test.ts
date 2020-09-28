import db from '../../db/index';
import * as faker from 'faker';
import { createUser, doesUserExist } from './userService';

describe('test the User service', () => {
  let Db: any = db;

  beforeAll(async () => {
    await Db.sequelize.sync({ force: true });
  });

  it('should return user details if a user exists', async () => {
    const randomString = faker.random.alphaNumeric(10);
    const password = `password`;

    await createUser({
      name: `John`,
      email: `user-${randomString}@email.com`,
      password
    });

    const UserExist = await doesUserExist({
      name: `John`,
      email: `user-${randomString}@email.com`,
      password
    });

    expect(UserExist).toMatchObject({
      id: expect.any(Number)
    });
  });

  it('should return null if a user does not exist', async () => {
    const randomString = faker.random.alphaNumeric(10);
    const UserExist = await doesUserExist({
      name: `John`,
      email: `user-${randomString}@email.com`,
      password: 'password'
    });

    expect(UserExist).toBeNull();
  });

  afterAll(async (done) => {
    await Db.sequelize.close();
    done();
  });
});
