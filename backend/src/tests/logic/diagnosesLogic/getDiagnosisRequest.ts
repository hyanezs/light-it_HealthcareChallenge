import { getDiagnosesRequestById } from '../../../dataAccess/repositories';
import { NotFoundError, ServerError } from '../../../exceptions';
import { getDiagnosesRequest } from '../../../logic/diagnosesLogic';
import { Genders } from '../../../types';
import { DiagnosesRequestModel, UserModel } from '../../../types/models';

jest.mock('../../../dataAccess/repositories/diagnosesRequestRepository');

const diagnosesRequestInDb: Partial<DiagnosesRequestModel> = {
  id: 1,
  symptomsIds: '1,2',
  birthyear: 2000,
  gender: Genders.FEMALE,
  requestedOn: new Date(),
  possibleDiagnoses: [],
  userId: 1,
};

describe('getDiagnosesRequest', () => {
  const mockedGetDiagnosesRequestById = getDiagnosesRequestById as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user = {
    id: 1,
  };

  it('should return history', async () => {
    mockedGetDiagnosesRequestById.mockResolvedValue(diagnosesRequestInDb);

    const result = await getDiagnosesRequest(1, user as UserModel);

    expect(mockedGetDiagnosesRequestById).toHaveBeenCalledWith(1, user);
    expect(result).toEqual({
      id: 1,
      symptomsIds: '1,2',
      birthyear: 2000,
      gender: Genders.FEMALE,
      requestedOn: new Date(),
      possibleDiagnoses: [],
      userId: 1,
    });
  });

  it('should throw 404 error if theres no request for id', async () => {
    mockedGetDiagnosesRequestById.mockResolvedValue(null);

    await expect(getDiagnosesRequest(1, user as UserModel)).rejects.toThrow(
      new NotFoundError('Diagnosis request not found'),
    );
    expect(mockedGetDiagnosesRequestById).toHaveBeenCalledTimes(0);
  });

  it('should throw 404 error if theres a request but it doesnt belong to the user', async () => {
    mockedGetDiagnosesRequestById.mockResolvedValue({
      ...diagnosesRequestInDb,
      userId: 2,
    });

    await expect(getDiagnosesRequest(1, user as UserModel)).rejects.toThrow(
      new NotFoundError('Diagnosis request not found'),
    );
    expect(mockedGetDiagnosesRequestById).toHaveBeenCalledTimes(0);
  });

  it('should throw error if theres no user set', async () => {
    await expect(
      getDiagnosesRequest(1, undefined as unknown as UserModel),
    ).rejects.toThrow(new ServerError('User not found and should be set'));
    expect(mockedGetDiagnosesRequestById).toHaveBeenCalledTimes(0);
  });
});
