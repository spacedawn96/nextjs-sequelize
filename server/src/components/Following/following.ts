import { DataTypes, Model, BuildOptions } from 'sequelize';
import sequelize from '../../db';
import User from '../User/user';

interface Following extends Model {
  readonly id: number;
  userId: number;
  following: number;
}

type FollowingStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Following;
  associate: any;
};

const Following = <FollowingStatic>sequelize.define('following', {
  userId: DataTypes.INTEGER,
  following: DataTypes.INTEGER
});

Following.associate = function associate() {
  Following.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  Following.belongsTo(User, {
    foreignKey: 'following',
    onDelete: 'CASCADE',
    as: 'followingDetails'
  });
};

export default Following;
