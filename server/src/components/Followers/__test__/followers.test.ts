import db from '../../../db/index';
import * as faker from 'faker';
import { createUser } from '../../User/userService';
import { createFollow, destroyFollow } from '../followerService';

describe('test the User service', () => {
  let Db: any = db;

  beforeAll(async () => {
    await Db.sync({ force: true });
  });

  it('should return userFollow details', async () => {
    const randomString = faker.random.alphaNumeric(10);
    const password = `password`;

    const user = {
      id: 1,
      name: `John`,
      email: `user-${randomString}@email.com`,
      password
    };

    const user2 = {
      id: 2,
      name: `John2`,
      email: `user-${randomString}@email.com`,
      password
    };

    await Promise.all([createUser(user), createUser(user2)]);

    const Follow = await createFollow(user, 2);

    expect(Follow).toBe(true);
  });

  it('should return userFollow destroy details', async () => {
    const randomString = faker.random.alphaNumeric(10);
    const password = `password`;

    const user = {
      id: 1,
      name: `John`,
      email: `user-${randomString}@email.com`,
      password
    };

    const user2 = {
      id: 2,
      name: `John2`,
      email: `user-${randomString}@email.com`,
      password
    };

    await Promise.all([createUser(user), createUser(user2)]);

    const Follow = await destroyFollow(user, 2);

    expect(Follow).toBe(true);
  });

  afterAll(async (done) => {
    await Db.close();
    done();
  });
});
