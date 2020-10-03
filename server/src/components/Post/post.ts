import { DataTypes, Model, BuildOptions } from 'sequelize';
import sequelize from '../../db';
import Comment from '../Comment.ts/comments';
import PostLike from '../PostLike.ts/postLike';
import User from '../User/user';

interface PostInstance extends Model {
  id: number;
  title: string;
  body: string;
  likedByMe: boolean;
  likeCounts: number;
  userId: number;
}

type PostStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): PostInstance;
  associate: any;
};

const Post = <PostStatic>sequelize.define('post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false
  },

  likedByMe: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  likeCounts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  userId: DataTypes.INTEGER
});

Post.associate = function associate() {
  Post.belongsTo(User, {
    as: 'author',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  Post.hasMany(Comment, {
    foreignKey: 'postId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
  });
  Post.hasMany(PostLike, {
    foreignKey: 'resourceId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
  });
};

export default Post;
