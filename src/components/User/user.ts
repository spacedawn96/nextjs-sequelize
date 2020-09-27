import { DataTypes, Model, BuildOptions } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sequelize from '../../config/db';

interface UserInstance extends Model {
  readonly id: number;
  name: string;
  password: string;
  getSignedJwtToken(): string;
  getResetToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserInstance;
  associate: any;
};

const User = <UserStatic>sequelize.define('users', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlphanumeric: {
        msg: 'The username can only contain letters and numbers',
      },
      len: {
        args: [4, 15],
        msg: 'The username needs to be between 4 and 15 characteres long',
      },
    },
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 6,
    },
  },
  resetPasswordToken: DataTypes.STRING,
  resetPasswordExpire: DataTypes.DATE,
});

User.associate = function associate() {};

User.prototype.getSignedJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.SECRET_KEY!, {
    expiresIn: 36000,
  });
};

User.prototype.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

User.beforeSave(async (user) => {
  if (!user.changed('password')) {
    return;
  }
  const salt = await bcrypt.genSaltSync();
  user.password = await bcrypt.hashSync(user.password, salt);
});

export default User;
