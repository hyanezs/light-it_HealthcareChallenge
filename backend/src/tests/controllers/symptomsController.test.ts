import request from 'supertest';
import * as symptomsLogic from '../../logic/symptomsLogic';
import { app } from '../../server';
import { Symptom } from '../../types';

describe('GET /symptoms', () => {
  it('should return a valid response with symptoms', async () => {
    // Mock the getSymptoms function
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

    jest.spyOn(symptomsLogic, 'getSymptoms').mockResolvedValue(mockedSymptoms);

    const response = await request(app).get('/symptoms');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedSymptoms);
    // Add additional assertions as needed
  });

  it('should handle errors and return an error response', async () => {
    // Mock the getSymptoms function to throw an error
    const errorMessage = 'An error occurred';
    jest
      .spyOn(symptomsLogic, 'getSymptoms')
      .mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get('/symptoms');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
    // Add additional assertions as needed
  });
});
