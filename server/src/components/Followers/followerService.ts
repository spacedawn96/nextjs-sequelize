import Following from '../Following/following';
import User from '../User/user';
import Followers from './followers';

export const createFollow = async (userToFollow: any, curUser: number) => {
  const createFolloing = await Following.create({
    following: userToFollow!.id,
    userId: curUser
  });

  const createFollower = await Followers.create({
    followerId: curUser,
    userId: userToFollow!.id
  });

  await Promise.all([createFolloing, createFollower]);

  return true;
};

export const findUserByName = async (name: string) => {
  const user = await User.findOne({
    where: {
      name
    }
  });

  return user;
};

export const findUserFollowDetail = async (userToFollow: any) => {
  const userFound = User.findOne({
    where: {
      id: userToFollow!.id
    },
    include: [
      {
        model: Followers,
        as: 'UserFollowers',
        include: [
          {
            model: User,
            as: 'followerDetails',
            attributes: ['name']
          }
        ]
      },
      {
        model: Following,
        as: 'UserFollowings'
      }
    ]
  });

  return userFound;
};

export const destroyFollow = async (userToFollow: any, curUser: number) => {
  const destroyFollowing = await Following.destroy({
    where: {
      following: userToFollow!.id,
      userId: curUser
    }
  });
  const destroyFollower = await Followers.destroy({
    where: {
      followerId: curUser,
      userId: userToFollow!.id
    }
  });

  await Promise.all([destroyFollowing, destroyFollower]);

  return true;
};
