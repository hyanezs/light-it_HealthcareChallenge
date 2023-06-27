import { DataTypes } from 'sequelize';
import { type DiagnosesRequestModel } from '../../types/models';
import { masterDb } from '../postgres';
import Diagnosis from './diagnosis';
import User from './user';

const DiagnosesRequest = masterDb.define<DiagnosesRequestModel>(
  'diagnosesRequest',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    requestedOn: { type: DataTypes.DATE, allowNull: false },
    gender: { type: DataTypes.INTEGER, allowNull: false },
    birthyear: { type: DataTypes.INTEGER, allowNull: false },
    symptomsIds: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key
  },
);

DiagnosesRequest.hasMany(Diagnosis, {
  foreignKey: 'diagnosesRequestId',
  as: 'possibleDiagnoses',
});

Diagnosis.belongsTo(DiagnosesRequest);

DiagnosesRequest.belongsTo(User);

export default DiagnosesRequest;
