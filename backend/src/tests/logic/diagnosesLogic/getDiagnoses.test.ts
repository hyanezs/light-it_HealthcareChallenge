import MockAdapter from 'axios-mock-adapter';
import { clearCachePreffix } from '../../../dataAccess/cache';
import { persistDiagnosesRequest } from '../../../dataAccess/repositories/diagnosesRequestRepository';
import { BadRequestError, ServerError } from '../../../exceptions';
import { authenticateApiMedic } from '../../../external/apiMedic/authenticate';
import {
  endpoints,
  healthApiMedic,
} from '../../../external/apiMedic/instances';
import transformDiagnosisResponse from '../../../external/apiMedic/utils';
import { getPossibleDiagnoses } from '../../../logic/diagnosesLogic';
import { UserModel } from '../../../types/models';
import { validateGetPossibleDiagnosesReqBody } from '../../../validations';

jest.mock('../../../external/apiMedic/authenticate');
jest.mock('../../../validations');
jest.mock('../../../dataAccess/cache');
jest.mock('../../../dataAccess/repositories/diagnosesRequestRepository');
jest.mock('../../../external/apiMedic/utils');

describe('getPossibleDiagnoses', () => {
  const mockedAuthenticateApiMedic = authenticateApiMedic as jest.Mock;
  const mockedValidateGetPossibleDiagnosesReqBody =
    validateGetPossibleDiagnosesReqBody as jest.Mock;
  const mockedClearCachePreffix = clearCachePreffix as jest.Mock;
  const mockedPersistDiagnosesRequest = persistDiagnosesRequest as jest.Mock;
  const mockedTransformDiagnosisResponse =
    transformDiagnosisResponse as jest.Mock;

  let mockedApiMedic = new MockAdapter(healthApiMedic);

  afterEach(() => {
    jest.clearAllMocks();
    mockedApiMedic.reset();
  });

  const params = {
    birthyear: '1990',
    gender: 'male',
    symptomsIds: [1, 2],
  };

  const user = {
    id: 1,
  };

  it('should return diagnoses from API if call is successful', async () => {
    const apiResponse = ['diagnosi1', 'diagnosi2'];
    mockedApiMedic.onGet(endpoints.diagnosis).replyOnce(200, apiResponse);
    mockedValidateGetPossibleDiagnosesReqBody.mockImplementation(() => {});
    mockedPersistDiagnosesRequest.mockImplementation(() => {});
    mockedTransformDiagnosisResponse.mockImplementation(() => {});

    const result = await getPossibleDiagnoses(params, user as UserModel);

    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe(endpoints.diagnosis);
    expect(mockedApiMedic.history.get[0].params).toStrictEqual({
      year_of_birth: '1990',
      gender: 'male',
      symptoms: '[1,2]',
    });
    expect(mockedValidateGetPossibleDiagnosesReqBody).toHaveBeenCalledTimes(1);
    expect(mockedPersistDiagnosesRequest).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['diagnosi1', 'diagnosi2']);
    expect(mockedClearCachePreffix).toHaveBeenCalledTimes(0);
    expect(mockedAuthenticateApiMedic).toHaveBeenCalledTimes(0);
  });

  it('should throw error if validation fails', async () => {
    mockedValidateGetPossibleDiagnosesReqBody.mockImplementation(() => {
      throw new BadRequestError('Some validation error');
    });
    mockedPersistDiagnosesRequest.mockImplementation(() => {});
    mockedTransformDiagnosisResponse.mockImplementation(() => {});
    await expect(
      getPossibleDiagnoses(params, user as UserModel),
    ).rejects.toThrow(new BadRequestError('Some validation error'));
    expect(mockedApiMedic.history.get.length).toBe(0);
    expect(authenticateApiMedic).toHaveBeenCalledTimes(0);
    expect(mockedClearCachePreffix).toHaveBeenCalledTimes(0);
    expect(mockedValidateGetPossibleDiagnosesReqBody).toHaveBeenCalledTimes(1);
    expect(mockedPersistDiagnosesRequest).toHaveBeenCalledTimes(0);
  });

  it('should retry API call if token was invalid', async () => {
    const apiResponse = ['diagnosi1', 'diagnosi2'];

    mockedTransformDiagnosisResponse.mockImplementation(() => {});

    mockedApiMedic
      .onGet(endpoints.diagnosis)
      .replyOnce(400, 'Missing or invalid token')
      .onGet(endpoints.diagnosis)
      .replyOnce(200, apiResponse);

    mockedValidateGetPossibleDiagnosesReqBody.mockImplementation(() => {});
    mockedAuthenticateApiMedic.mockImplementation(() => {});
    mockedClearCachePreffix.mockImplementation(() => {});
    mockedPersistDiagnosesRequest.mockImplementation(() => {});

    const result = await getPossibleDiagnoses(params, user as UserModel);

    expect(mockedApiMedic.history.get.length).toBe(2);
    expect(mockedApiMedic.history.get[0].url).toBe(endpoints.diagnosis);
    expect(mockedApiMedic.history.get[0].params).toStrictEqual({
      year_of_birth: '1990',
      gender: 'male',
      symptoms: '[1,2]',
    });
    expect(mockedApiMedic.history.get[1].url).toBe(endpoints.diagnosis);
    expect(mockedApiMedic.history.get[1].params).toStrictEqual({
      year_of_birth: '1990',
      gender: 'male',
      symptoms: '[1,2]',
    });
    expect(mockedPersistDiagnosesRequest).toHaveBeenCalledTimes(1);
    expect(mockedValidateGetPossibleDiagnosesReqBody).toHaveBeenCalledTimes(2);
    expect(authenticateApiMedic).toHaveBeenCalledTimes(1);
    expect(clearCachePreffix).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['diagnosi1', 'diagnosi2']);
  });

  it('should throw an error when the API call fails with an unknown error', async () => {
    mockedApiMedic
      .onGet(endpoints.diagnosis)
      .replyOnce(500, 'Some error message');
    mockedValidateGetPossibleDiagnosesReqBody.mockResolvedValue(undefined);

    await expect(
      getPossibleDiagnoses(params, user as UserModel),
    ).rejects.toStrictEqual(
      new ServerError('Error getting diagnoses from API Medic'),
    );
    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe(endpoints.diagnosis);
  });
});
