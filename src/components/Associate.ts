import User from './User/user';

export function associate() {
  User.associate();
}

export default function sync() {
  associate();
}
