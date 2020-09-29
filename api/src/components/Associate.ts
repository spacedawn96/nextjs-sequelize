import Comment from './Comment.ts/comments';
import Followers from './Followers/followers';
import Following from './Following/following';
import Post from './Post/post';
import PostLike from './PostLike.ts/postLike';
import User from './User/user';

export function associate() {
  User.associate();
  Post.associate();
  Comment.associate();
  PostLike.associate();
  Followers.associate();
  Following.associate();
}

export default function sync() {
  associate();
}
