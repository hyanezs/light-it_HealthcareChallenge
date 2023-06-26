import MockAdapter from 'axios-mock-adapter';
import {
  cacheKeys,
  clearCachePreffix,
  findInCache,
  setInCache,
} from '../../../dataAccess/cache';
import { ServerError } from '../../../exceptions';
import { authenticateApiMedic } from '../../../external/apiMedic/authenticate';
import { healthApiMedic } from '../../../external/apiMedic/instances';
import { getSymptoms } from '../../../logic/symptomsLogic';

jest.mock('../../../external/apiMedic/authenticate');
jest.mock('../../../dataAccess/cache');

describe('getSymptoms', () => {
  const mockedAuthenticateApiMedic = authenticateApiMedic as jest.Mock;
  const mockedClearCachePreffix = clearCachePreffix as jest.Mock;
  const mockedSetInCache = setInCache as jest.Mock;
  const mockedFindInCache = findInCache as jest.Mock;
  let mockedApiMedic = new MockAdapter(healthApiMedic);

  afterEach(() => {
    jest.clearAllMocks();
    mockedApiMedic.reset();
  });

  it('if cached should return obj symptoms from cache', async () => {
    mockedFindInCache.mockResolvedValue(
      JSON.stringify(['symptom1', 'symptom2']),
    );
    const result = await getSymptoms();

    expect(mockedApiMedic.history.get.length).toBe(0);
    expect(mockedSetInCache).not.toHaveBeenCalled();
    expect(mockedFindInCache).toHaveBeenCalledWith(cacheKeys.apiMedicSymptoms);
    expect(result).toEqual(['symptom1', 'symptom2']);
  });

  it('if not cached should return symptoms from API if call is successful', async () => {
    const apiResponse = ['symptom1', 'symptom2'];
    mockedFindInCache.mockResolvedValue(null);
    mockedApiMedic.onGet(`/symptoms`).replyOnce(200, apiResponse);
    mockedSetInCache.mockResolvedValue(null);
    const result = await getSymptoms();

    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe('/symptoms');
    expect(mockedSetInCache).toHaveBeenCalledWith(
      cacheKeys.apiMedicSymptoms,
      JSON.stringify(apiResponse),
      60 * 60 * 24,
    );
    expect(mockedFindInCache).toHaveBeenCalledWith(cacheKeys.apiMedicSymptoms);
    expect(result).toEqual(['symptom1', 'symptom2']);
  });

  it('if not cached should retry the API call after refreshing the token', async () => {
    const apiResponse = ['symptom1', 'symptom2'];

    mockedFindInCache.mockResolvedValue(null);
    mockedApiMedic
      .onGet('/symptoms')
      .replyOnce(400, 'Missing or invalid token')
      .onGet('/symptoms')
      .replyOnce(200, apiResponse);
    mockedSetInCache.mockResolvedValue(null);
    mockedAuthenticateApiMedic.mockImplementation(() => {});
    mockedClearCachePreffix.mockImplementation(() => {});

    const result = await getSymptoms();

    expect(mockedApiMedic.history.get.length).toBe(2);
    expect(mockedApiMedic.history.get[0].url).toBe('/symptoms');
    expect(mockedApiMedic.history.get[1].url).toBe('/symptoms');
    expect(result).toEqual(['symptom1', 'symptom2']);
    expect(clearCachePreffix).toHaveBeenCalledWith(cacheKeys.apiMedicToken);
    expect(authenticateApiMedic).toHaveBeenCalledTimes(1);
    expect(mockedSetInCache).toHaveBeenCalledWith(
      cacheKeys.apiMedicSymptoms,
      JSON.stringify(apiResponse),
      60 * 60 * 24,
    );
  });

  it('if not cached should throw an error when the API call fails with an unknown error', async () => {
    mockedApiMedic.onGet('/symptoms').replyOnce(500, 'Some error message');
    mockedFindInCache.mockResolvedValue(null);
    await expect(getSymptoms()).rejects.toStrictEqual(
      new ServerError('Error getting symptoms from API Medic'),
    );
    expect(mockedApiMedic.history.get.length).toBe(1);
    expect(mockedApiMedic.history.get[0].url).toBe('/symptoms');
    expect(mockedSetInCache).not.toHaveBeenCalled();
  });
});
