import Comment from '../Comment.ts/comments';
import PostLike from '../PostLike.ts/postLike';
import User from '../User/user';
import Post from './post';

interface postData {
  title: string;
  body: string;
  userId: number;
}
export const getpostPage = async (id: number) => {
  const postPage = await Post.findOne({
    where: {
      id
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['name', 'bio']
      },
      {
        model: PostLike
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['name']
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return postPage;
};

export const Posts = async () => {
  const posts = await Post.findAll({
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['name', 'bio']
      },
      {
        model: PostLike
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['name', 'bio']
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return posts;
};

export const PostCreate = async (postData: postData) => {
  const createPost = await Post.create(postData).then((post) => {
    Post.findOne({
      where: {
        id: post.id
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['name']
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['name']
            }
          ]
        }
      ]
    });
  });

  return createPost;
};

export const updatePost = async (title: string, body: string, id: number) => {
  const postUpdate = Post.update(
    {
      title: title ? title : '',
      body: body ? body : ''
    },
    {
      returning: true,
      where: {
        id
      }
    }
  );

  return postUpdate;
};
