import MockAdapter from 'axios-mock-adapter';
import { BadRequestError, ServerError } from '../../../exceptions';
import { authenticateApiMedic } from '../../../external/apiMedic/authenticate';
import { healthApiMedic } from '../../../external/apiMedic/instances';
import getDiagnosis from '../../../logic/diagnosisLogic';
import { validateGetDiagnosisParams } from '../../../validations';
import { clearCachePreffix } from '../../../dataAccess/cache';

jest.mock('../../../external/apiMedic/authenticate');
jest.mock('../../../validations');
jest.mock('../../../dataAccess/cache');

describe('getDiagnosis', () => {
  const mockedAuthenticateApiMedic = authenticateApiMedic as jest.Mock;
  const mockedValidateGetDiagnosisParams =
    validateGetDiagnosisParams as jest.Mock;
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

  it('should return diagnosis from API if call is successful', async () => {
    const apiResponse = ['diagnosi1', 'diagnosi2'];
    mockedApiMedic.onGet(`/diagnosis`).replyOnce(200, apiResponse);
    mockedValidateGetDiagnosisParams.mockImplementation(() => {});

    const result = await getDiagnosis(params);

    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe('/diagnosis');
    expect(mockedApiMedic.history.get[0].params).toStrictEqual({
      year_of_birth: '1990',
      gender: 'male',
      symptoms: '[1,2]',
    });
    expect(mockedValidateGetDiagnosisParams).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['diagnosi1', 'diagnosi2']);
  });

  it('should throw error if validation fails', async () => {
    mockedValidateGetDiagnosisParams.mockImplementation(() => {
      throw new BadRequestError('Some validation error');
    });

    await expect(getDiagnosis(params)).rejects.toThrow(
      new BadRequestError('Some validation error'),
    );
    expect(mockedApiMedic.history.get.length).toBe(0);
    expect(authenticateApiMedic).toHaveBeenCalledTimes(0);
    expect(mockedValidateGetDiagnosisParams).toHaveBeenCalledTimes(1);
  });

  it('should retry API call if token was invalid', async () => {
    const apiResponse = ['diagnosi1', 'diagnosi2'];

    mockedApiMedic
      .onGet('/diagnosis')
      .replyOnce(400, 'Missing or invalid token')
      .onGet('/diagnosis')
      .replyOnce(200, apiResponse);

    mockedValidateGetDiagnosisParams.mockImplementation(() => {});
    mockedAuthenticateApiMedic.mockImplementation(() => {});
    mockedClearCachePreffix.mockImplementation(() => {});

    const result = await getDiagnosis(params);

    expect(mockedApiMedic.history.get.length).toBe(2);
    expect(mockedApiMedic.history.get[0].url).toBe('/diagnosis');
    expect(mockedApiMedic.history.get[0].params).toStrictEqual({
      year_of_birth: '1990',
      gender: 'male',
      symptoms: '[1,2]',
    });
    expect(mockedApiMedic.history.get[1].url).toBe('/diagnosis');
    expect(mockedApiMedic.history.get[1].params).toStrictEqual({
      year_of_birth: '1990',
      gender: 'male',
      symptoms: '[1,2]',
    });

    expect(mockedValidateGetDiagnosisParams).toHaveBeenCalledTimes(2);
    expect(authenticateApiMedic).toHaveBeenCalledTimes(1);
    expect(clearCachePreffix).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['diagnosi1', 'diagnosi2']);
  });

  it('should throw an error when the API call fails with an unknown error', async () => {
    mockedApiMedic.onGet('/diagnosis').replyOnce(500, 'Some error message');
    mockedValidateGetDiagnosisParams.mockResolvedValue(undefined);

    await expect(getDiagnosis(params)).rejects.toStrictEqual(
      new ServerError('Error getting diagnosis from API Medic'),
    );
    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe('/diagnosis');
  });
});
