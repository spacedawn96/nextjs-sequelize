import User from './user';

interface credentials {
  name: string;
  email: string;
  password: string;
}

export const doesUserExist = async (credentials: credentials) => {
  const registeredEmail = await User.findOne({
    where: {
      email: credentials.email
    }
  });

  const registeredUserName = await User.findOne({
    where: {
      name: credentials.name
    }
  });

  const isUserExist = registeredEmail && registeredUserName;

  return isUserExist;
};

export const createUser = async (credentials: credentials) => {
  const user = await User.create({
    name: credentials.name,
    email: credentials.email,
    password: credentials.password
  });

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
