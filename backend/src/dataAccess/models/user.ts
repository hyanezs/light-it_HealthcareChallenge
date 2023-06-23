import { DataTypes } from 'sequelize';
import { type UserModel } from '../../types/models';
import { masterDb } from '../postgres';

const User = masterDb.define<UserModel>('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.INTEGER, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  birthdate: { type: DataTypes.DATE, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

export default User;
