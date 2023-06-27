import { DataTypes } from 'sequelize';
import { masterDb } from '../postgres';

const Gender = masterDb.define('gender', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  label: { type: DataTypes.STRING, allowNull: false },
});

export default Gender;
