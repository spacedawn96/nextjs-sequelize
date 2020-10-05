import Post from '../Post/post';
import User from '../User/user';
import PostLike from './postLike';

export const PostLiked = async (currentUser: number, resourceId: number) => {
  const findPostLike = await PostLike.findOne({
    where: {
      userId: currentUser,
      resourceId
    }
  });

  return findPostLike;
};

export const isPostLike = async (id: number) => {
  const isPostLike = await Post.findOne({
    where: {
      id
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['name']
      },

      {
        model: PostLike
      }
    ]
  });

  return isPostLike;
};
