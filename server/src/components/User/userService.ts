import Followers from '../Followers/followers';
import Following from '../Following/following';
import User from './user';

interface credentials {
  name: string;
  email: string;
  password: string;
}

interface userData {
  bio: string;
}

export const doesUserExist = async (credentials: credentials) => {
  const [registeredEmail, registeredUserName]: any = await Promise.all([
    User.findOne({
      where: {
        email: credentials.email
      }
    }),
    User.findOne({
      where: {
        name: credentials.name
      }
    })
  ]);

  const isUserExist = registeredEmail && registeredUserName;

  return isUserExist;
};

export const createUser = async (credentials: credentials, t?: any) => {
  const user = await User.create(
    {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password
    },
    { transaction: t }
  );

  return user;
};

export const findUser = async (credentials: credentials) => {
  const user = await User.findOne({
    where: {
      email: credentials.email
    }
  });

  return user;
};

export const findUserId = async (id: number) => {
  const user = await User.findOne({ where: { id }, attributes: ['bio'] });

  return user;
};

export const findUserDetail = async (name: string) => {
  const findUser = await User.findOne({
    where: {
      name
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

  return findUser;
};

export const findUserAll = async () => {
  const users = await User.findAll({
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
        as: 'UserFollowings',
        include: [
          {
            model: User,
            as: 'followingDetails',
            attributes: ['name']
          }
        ]
      }
    ],
    order: [['id', 'ASC']]
  });

  return users;
};

export const editProfile = async (
  userData: userData,
  curUser: number,
  t: any
) => {
  const updateUser = User.update(
    {
      bio: userData
    },
    {
      where: {
        id: curUser
      },
      transaction: t
    }
  );

  return updateUser;
};
