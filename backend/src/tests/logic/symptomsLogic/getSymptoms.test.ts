import axios from 'axios';
import { clearCachePreffix } from '../../../dataAccess/cache';
import {
  authenticateApiMedic,
  healthApiMedic,
} from '../../../external/apiMedic';
import { getSymptoms } from '../../../logic/symptomsLogic';

jest.mock('../../../external/apiMedic');
jest.mock('axios');
jest.mock('../../../dataAccess/cache');

describe('getSymptoms', () => {
  const mockedAuthenticateApiMedic = authenticateApiMedic as jest.Mock;
  const mockedClearCachePreffix = clearCachePreffix as jest.Mock;

  it('should return symptoms when the API call is successful', async () => {
    const mockResponse = {
      data: ['symptom1', 'symptom2'],
      status: 200,
      statusText: 'OK',
      headers: {},
    };

    (axios.create as jest.Mock<any, any>).mockReturnValue({
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },

      get: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getSymptoms();

    expect(healthApiMedic.get).toHaveBeenCalledWith('/symptoms');
    expect(result).toEqual(['symptom1', 'symptom2']);
  });

  it('should retry the API call after refreshing the token', async () => {
    const mockErrorResponse = {
      data: 'Missing or invalid token',
      status: 400,
      statusText: 'Bad Request',
      headers: {},
    };

    const mockSuccessfulResponse = {
      data: ['symptom1', 'symptom2'],
      status: 200,
      statusText: 'OK',
      headers: {},
    };

    (axios.create as jest.Mock<any, any>).mockReturnValue({
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },

      get: jest
        .fn()
        .mockRejectedValueOnce(mockErrorResponse)
        .mockResolvedValueOnce(mockSuccessfulResponse),
    });

    mockedAuthenticateApiMedic.mockImplementation(() => {});
    mockedClearCachePreffix.mockImplementation(() => {});

    const result = await getSymptoms();

    expect(healthApiMedic.get).toHaveBeenCalledWith('/symptoms');
    expect(axios).toHaveBeenCalledTimes(1); // Ensure the token was refreshed
    expect(healthApiMedic.get).toHaveBeenCalledTimes(2); // Ensure the API call was retried
    expect(result).toEqual(['symptom1', 'symptom2']);
    expect(clearCachePreffix).toHaveBeenCalledWith('apiMedicToken');
    expect(authenticateApiMedic).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the API call fails with an unknown error', async () => {
    const mockErrorResponse = {
      data: 'Some error message',
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
    };

    (axios.create as jest.Mock<any, any>).mockReturnValue({
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },

      get: jest.fn().mockRejectedValueOnce(mockErrorResponse),
    });

    await expect(getSymptoms()).rejects.toEqual(mockErrorResponse);
    expect(healthApiMedic.get).toHaveBeenCalledWith('/symptoms');
  });
});
