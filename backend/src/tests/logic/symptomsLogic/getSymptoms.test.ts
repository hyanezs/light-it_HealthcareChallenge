import MockAdapter from 'axios-mock-adapter';
import { clearCachePreffix } from '../../../dataAccess/cache';
import { ServerError } from '../../../exceptions';
import { authenticateApiMedic } from '../../../external/apiMedic/authenticate';
import { healthApiMedic } from '../../../external/apiMedic/instances';
import { getSymptoms } from '../../../logic/symptomsLogic';

jest.mock('../../../external/apiMedic/authenticate');
jest.mock('../../../dataAccess/cache');

const { API_MEDIC_HEALTH_URL } = process.env;

describe('getSymptoms', () => {
  const mockedAuthenticateApiMedic = authenticateApiMedic as jest.Mock;
  const mockedClearCachePreffix = clearCachePreffix as jest.Mock;
  let mockedApiMedic = new MockAdapter(healthApiMedic);

  afterEach(() => {
    jest.clearAllMocks();
    mockedApiMedic.reset();
  });

  it('should return symptoms when the API call is successful', async () => {
    const mockResponse = {
      data: ['symptom1', 'symptom2'],
    };

    mockedApiMedic.onGet(`/symptoms`).reply(200, mockResponse);

    const result = await getSymptoms();

    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe('/symptoms');
    expect(result).toEqual({ data: ['symptom1', 'symptom2'] });
  });

  it('should retry the API call after refreshing the token', async () => {
    const mockResponse = {
      data: ['symptom1', 'symptom2'],
    };

    mockedApiMedic
      .onGet('/symptoms')
      .replyOnce(400, 'Missing or invalid token')
      .onGet('/symptoms')
      .replyOnce(200, mockResponse);

    mockedAuthenticateApiMedic.mockImplementation(() => {});
    mockedClearCachePreffix.mockImplementation(() => {});

    const result = await getSymptoms();

    expect(mockedApiMedic.history.get.length).toBe(2);
    expect(mockedApiMedic.history.get[0].url).toBe('/symptoms');
    expect(mockedApiMedic.history.get[1].url).toBe('/symptoms');
    expect(result).toEqual({ data: ['symptom1', 'symptom2'] });
    expect(clearCachePreffix).toHaveBeenCalledWith('apiMedicToken');
    expect(authenticateApiMedic).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the API call fails with an unknown error', async () => {
    mockedApiMedic.onGet('/symptoms').replyOnce(500, 'Some error message');

    await expect(getSymptoms()).rejects.toStrictEqual(
      new ServerError('Error getting symptoms from API Medic'),
    );
    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe('/symptoms');
  });
});
