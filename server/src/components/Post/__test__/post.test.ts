import db from '../../../db/index';
import * as faker from 'faker';
import sequelize from '../../../db/index';
import { createUser } from '../../User/userService';
import { PostCreate, updatePost } from '../postService';

describe('test the Post service', () => {
  let Db: any = db;

  beforeAll(async () => {
    await Db.sync({ force: true });
  });

  it('should return postData', async () => {
    const randomString = faker.random.alphaNumeric(10);
    const password = `password`;

    const user = {
      id: 40,
      name: `John`,
      email: `user-${randomString}@email.com`,
      password
    };

    await createUser(user);

    const postData = {
      title: randomString,
      body: randomString,
      userId: user.id
    };
    const newPost = await PostCreate(postData);

    expect(newPost).toMatchObject({
      id: expect.any(Number)
    });
  });

  it('should return postData', async () => {
    const randomString = faker.random.alphaNumeric(10);
    const password = `password`;

    const user = {
      id: 40,
      name: `John`,
      email: `user-${randomString}@email.com`,
      password
    };

    await createUser(user);

    const postData = {
      title: randomString,
      body: randomString,
      userId: user.id
    };
    await PostCreate(postData);

    const post = await updatePost(
      postData.title,
      postData.body,
      postData.userId
    );

    expect(post).toEqual(expect.arrayContaining([expect.any(Number)]));
  });

  afterAll(async (done) => {
    await Db.close();
    done();
  });
});
