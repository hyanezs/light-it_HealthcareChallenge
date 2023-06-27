import { getDiagnosesRequestsByCondition } from '../../../dataAccess/repositories';
import { ServerError } from '../../../exceptions';
import { getUsersDiagnosesHistory } from '../../../logic/diagnosesLogic';
import { Genders } from '../../../types';
import { DiagnosesRequestModel, UserModel } from '../../../types/models';

jest.mock('../../../dataAccess/repositories/diagnosesRequestRepository');

const date = new Date();

const diagnosesRequestInDb: Partial<DiagnosesRequestModel> = {
  id: 1,
  symptomsIds: '1,2',
  birthyear: 2000,
  gender: Genders.FEMALE,
  requestedOn: date,
  possibleDiagnoses: [],
  userId: 1,
};

describe('getUsersDiagnosesHistory', () => {
  const mockedGetDiagnosesRequestsByCondition =
    getDiagnosesRequestsByCondition as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user = {
    id: 1,
  };

  it('should return history', async () => {
    mockedGetDiagnosesRequestsByCondition.mockResolvedValue([
      diagnosesRequestInDb,
    ]);

    const result = await getUsersDiagnosesHistory(user as UserModel);

    expect(mockedGetDiagnosesRequestsByCondition).toHaveBeenCalledWith({
      userId: 1,
    });
    expect(result).toEqual([
      {
        id: 1,
        symptomsIds: '1,2',
        birthyear: 2000,
        gender: Genders.FEMALE,
        requestedOn: date,
        possibleDiagnoses: [],
        userId: 1,
      },
    ]);
  });

  it('should throw error if theres no user set', async () => {
    await expect(
      getUsersDiagnosesHistory(undefined as unknown as UserModel),
    ).rejects.toThrow(new ServerError('User not found and should be set'));
    expect(mockedGetDiagnosesRequestsByCondition).toHaveBeenCalledTimes(0);
  });
});
