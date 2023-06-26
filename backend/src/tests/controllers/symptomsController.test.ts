import request from 'supertest';
import { getSymptoms } from '../../logic/symptomsLogic';
import { app } from '../../server';
import { Symptom } from '../../types';

jest.mock('../../logic/symptomsLogic');

describe('GET /symptoms', () => {
  const mockedGetSymptoms = getSymptoms as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid response with symptoms', async () => {
    const mockedSymptoms: Symptom[] = [
      {
        ID: 1,
        Name: 'Fever',
      },
      {
        ID: 2,
        Name: 'Dry Cough',
      },
    ];

    mockedGetSymptoms.mockResolvedValue(mockedSymptoms);

    const response = await request(app).get('/symptoms');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: mockedSymptoms });
  });

  it('should handle errors and return an error response', async () => {
    const errorMessage = 'An error occurred';

    mockedGetSymptoms.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get('/symptoms');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
  });
});
