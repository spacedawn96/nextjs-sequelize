import { DataTypes, Model, BuildOptions } from 'sequelize';
import sequelize from '../../db';
import Post from '../Post/post';
import User from '../User/user';

interface Comment extends Model {
  id: number;
  title: string;
  postId: number;
  userId: number;
}

type CommentStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Comment;
  associate: any;
};

const Comment = <CommentStatic>sequelize.define('comment', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: DataTypes.INTEGER,
  postId: DataTypes.INTEGER
});

Comment.associate = function associate() {
  Comment.belongsTo(User, {
    as: 'author',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  Comment.belongsTo(Post, {
    foreignKey: 'postId',
    onDelete: 'CASCADE',
    targetKey: 'id'
  });
};

export default Comment;
