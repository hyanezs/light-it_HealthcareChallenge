import { type DiagnosisModel } from '../../types/models';
import Diagnosis from '../models/diagnosis';

const updateDiagnosis = async (
  id: number,
  data: DiagnosisModel,
): Promise<[affectedCount: number] | undefined> =>
  Diagnosis.update(data, {
    where: {
      id,
    },
  });

export { updateDiagnosis };
