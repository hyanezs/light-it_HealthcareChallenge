import { DataTypes } from 'sequelize';
import { masterDb } from '../postgres';

const Gender = masterDb.define('gender', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  label: { type: DataTypes.STRING, allowNull: false },
});

void Gender.sync().then(async () => {
  await Gender.create({
    id: 0,
    label: 'UNKNOWN',
  });
  await Gender.create({
    id: 1,
    label: 'MALE',
  });
  await Gender.create({
    id: 2,
    label: 'FEMALE',
  });
  await Gender.create({
    id: 9,
    label: 'NOT_APPLICABLE',
  });
});

export default Gender;
