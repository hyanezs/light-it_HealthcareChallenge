import MockAdapter from 'axios-mock-adapter';
import { clearCachePreffix } from '../../../dataAccess/cache';
import { BadRequestError, ServerError } from '../../../exceptions';
import { authenticateApiMedic } from '../../../external/apiMedic/authenticate';
import {
  endpoints,
  healthApiMedic,
} from '../../../external/apiMedic/instances';
import getDiagnoses from '../../../logic/diagnosesLogic';
import { validateGetDiagnosesParams } from '../../../validations';

jest.mock('../../../external/apiMedic/authenticate');
jest.mock('../../../validations');
jest.mock('../../../dataAccess/cache');

describe('getDiagnoses', () => {
  const mockedAuthenticateApiMedic = authenticateApiMedic as jest.Mock;
  const mockedValidateGetDiagnosesParams =
    validateGetDiagnosesParams as jest.Mock;
  const mockedClearCachePreffix = clearCachePreffix as jest.Mock;

  let mockedApiMedic = new MockAdapter(healthApiMedic);

  afterEach(() => {
    jest.clearAllMocks();
    mockedApiMedic.reset();
  });

  const params = {
    birthyear: '1990',
    gender: 'male',
    symptomsIds: ['1', '2'],
  };

  it('should return diagnoses from API if call is successful', async () => {
    const apiResponse = ['diagnosi1', 'diagnosi2'];
    mockedApiMedic.onGet(endpoints.diagnosis).replyOnce(200, apiResponse);
    mockedValidateGetDiagnosesParams.mockImplementation(() => {});

    const result = await getDiagnoses(params);

    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe(endpoints.diagnosis);
    expect(mockedApiMedic.history.get[0].params).toStrictEqual({
      year_of_birth: '1990',
      gender: 'male',
      symptoms: '[1,2]',
    });
    expect(mockedValidateGetDiagnosesParams).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['diagnosi1', 'diagnosi2']);
  });

  it('should throw error if validation fails', async () => {
    mockedValidateGetDiagnosesParams.mockImplementation(() => {
      throw new BadRequestError('Some validation error');
    });

    await expect(getDiagnoses(params)).rejects.toThrow(
      new BadRequestError('Some validation error'),
    );
    expect(mockedApiMedic.history.get.length).toBe(0);
    expect(authenticateApiMedic).toHaveBeenCalledTimes(0);
    expect(mockedValidateGetDiagnosesParams).toHaveBeenCalledTimes(1);
  });

  it('should retry API call if token was invalid', async () => {
    const apiResponse = ['diagnosi1', 'diagnosi2'];

    mockedApiMedic
      .onGet(endpoints.diagnosis)
      .replyOnce(400, 'Missing or invalid token')
      .onGet(endpoints.diagnosis)
      .replyOnce(200, apiResponse);

    mockedValidateGetDiagnosesParams.mockImplementation(() => {});
    mockedAuthenticateApiMedic.mockImplementation(() => {});
    mockedClearCachePreffix.mockImplementation(() => {});

    const result = await getDiagnoses(params);

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

    expect(mockedValidateGetDiagnosesParams).toHaveBeenCalledTimes(2);
    expect(authenticateApiMedic).toHaveBeenCalledTimes(1);
    expect(clearCachePreffix).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['diagnosi1', 'diagnosi2']);
  });

  it('should throw an error when the API call fails with an unknown error', async () => {
    mockedApiMedic
      .onGet(endpoints.diagnosis)
      .replyOnce(500, 'Some error message');
    mockedValidateGetDiagnosesParams.mockResolvedValue(undefined);

    await expect(getDiagnoses(params)).rejects.toStrictEqual(
      new ServerError('Error getting diagnoses from API Medic'),
    );
    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe(endpoints.diagnosis);
  });
});
