import { DataTypes } from 'sequelize';
import { type DiagnosisModel } from '../../types/models';
import { masterDb } from '../postgres';

const Diagnosis = masterDb.define<DiagnosisModel>('diagnosis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
  name: { type: DataTypes.STRING, allowNull: false },
  accuracy: { type: DataTypes.FLOAT, allowNull: false },
  profName: { type: DataTypes.STRING, allowNull: false },
  icd: { type: DataTypes.STRING, allowNull: false },
  icdName: { type: DataTypes.STRING, allowNull: false },
  issueId: { type: DataTypes.INTEGER, allowNull: false },
  specialisationIds: { type: DataTypes.STRING, allowNull: false },
});

export default Diagnosis;
