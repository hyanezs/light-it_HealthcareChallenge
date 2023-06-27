import Diagnosis from '../../dataAccess/models/diagnosis';
import { updateDiagnosis } from '../../dataAccess/repositories';
import { DiagnosisModel } from '../../types/models';

const validDiagnosis: Partial<DiagnosisModel> = {
  issueId: 1,
  name: 'string',
  accuracy: 1,
  profName: 'string',
  icd: 'string',
  icdName: 'string',
  specialisationIds: 'string',
  confirmed: true,
  id: 1,
};

describe('updateDiagnosis', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a diagnosis', async () => {
    jest.spyOn(Diagnosis, 'update').mockResolvedValueOnce([1]);

    const result = await updateDiagnosis(1, validDiagnosis as DiagnosisModel);

    expect(result).toStrictEqual([1]);
    expect(Diagnosis.update).toHaveBeenCalledWith(validDiagnosis, {
      where: {
        id: 1,
      },
    });
  });

  it('should not update when diagnosis not found', async () => {
    jest.spyOn(Diagnosis, 'update').mockResolvedValueOnce([0]);

    const result = await updateDiagnosis(1, validDiagnosis as DiagnosisModel);

    expect(result).toStrictEqual([0]);
    expect(Diagnosis.update).toHaveBeenCalledWith(validDiagnosis, {
      where: {
        id: 1,
      },
    });
  });
});
