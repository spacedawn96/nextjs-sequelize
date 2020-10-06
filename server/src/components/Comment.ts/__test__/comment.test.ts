import db from '../../../db/index';
import * as faker from 'faker';
import sequelize from '../../../db/index';
import { createUser, findUser } from '../../User/userService';
import { PostCreate } from '../../Post/postService';
import { createCom, updateComment } from '../commentService';

describe('test the Comment service', () => {
  let Db: any = db;

  beforeAll(async () => {
    await Db.sync({ force: true });
  });

  it('should return newComment', async () => {
    const randomString = faker.random.alphaNumeric(10);
    const password = `password`;

    const user = {
      name: `John`,
      email: `user-${randomString}@email.com`,
      password
    } as any;

    await createUser(user);

    const postData = {
      id: 10,
      title: randomString,
      body: randomString,
      userId: user.id
    };
    await PostCreate(postData);

    const commentData = {
      title: randomString,
      userId: user.id,
      postId: postData.id
    };

    const newCom = await createCom(commentData);
    expect(newCom).toMatchObject({
      id: expect.any(Number)
    });
  });

  it('should return updateComment', async () => {
    const randomString = faker.random.alphaNumeric(10);
    const password = `password`;

    const user = {
      name: `John`,
      email: `user-${randomString}@email.com`,
      password
    } as any;

    await createUser(user);

    const postData = {
      id: 20,
      title: randomString,
      body: randomString,
      userId: user.id
    };
    await PostCreate(postData);

    const commentData = {
      id: 20,
      title: randomString,
      userId: user.id,
      postId: postData.id
    };

    const newCom = await createCom(commentData);

    const result = await sequelize.transaction(async (t) => {
      const updateCom = await updateComment(
        commentData.title,
        commentData.id,
        t
      );

      expect(updateCom).toEqual(expect.arrayContaining([expect.any(Number)]));
    });
  });

  afterAll(async (done) => {
    await Db.close();
    done();
  });
});
