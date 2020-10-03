import { DataTypes, Model, BuildOptions } from 'sequelize';
import sequelize from '../../db';
import User from '../User/user';

interface Followers extends Model {
  readonly id: number;
  followerId: number;
  userId: number;
}

type FollowersStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Followers;
  associate: any;
};

const Followers = <FollowersStatic>sequelize.define('followers', {
  userId: DataTypes.INTEGER,
  followerId: DataTypes.INTEGER
});

Followers.associate = function associate() {
  Followers.belongsTo(User, {
    foreignKey: 'userId',
    as: 'UserFollowers',
    onDelete: 'CASCADE'
  });
  Followers.belongsTo(User, {
    foreignKey: 'followerId',
    as: 'followerDetails',
    onDelete: 'CASCADE'
  });
};

export default Followers;
