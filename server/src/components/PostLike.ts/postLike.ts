import { DataTypes, Model, BuildOptions } from 'sequelize';
import sequelize from '../../db';
import Post from '../Post/post';
import User from '../User/user';

interface PostLike extends Model {
  id: number;
  resourceId: number;
  userId: number;
}

type PostLikeStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): PostLike;
  associate: any;
};

const PostLike = <PostLikeStatic>sequelize.define('post_like', {
  userId: DataTypes.INTEGER,
  resourceId: DataTypes.INTEGER
});

PostLike.associate = function associate() {
  PostLike.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    constraints: false
  });
  PostLike.belongsTo(Post, {
    foreignKey: 'resourceId',
    onDelete: 'CASCADE',
    targetKey: 'id',
    constraints: false
  });
};

export default PostLike;
