import request from 'supertest';
import getDiagnosis from '../../logic/diagnosisLogic';
import { app } from '../../server';
import { Diagnosis } from '../../types/external/diagnosis';

jest.mock('../../logic/diagnosisLogic');

describe('GET /diagnosis', () => {
  const mockedGetDiagnosis = getDiagnosis as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid response with diagnosis', async () => {
    const mockedDiagnosis: Diagnosis[] = [
      {
        Issue: {
          ID: 40,
          Name: 'Nasenbluten',
          ProfName: 'Epistaxis',
          Icd: 'A04.0',
          IcdName: 'Enteropathogenic Escherichia coli infection',
          Accuracy: 90,
        },
        Specialisation: [
          {
            ID: 15,
            Name: 'Allgemeinärzte',
            SpecialistID: 3,
          },
          {
            ID: 32,
            Name: 'Hals-Nasen-Ohrenärzte',
            SpecialistID: 49,
          },
        ],
      },
    ];

    mockedGetDiagnosis.mockResolvedValue(mockedDiagnosis);

    const response = await request(app)
      .get('/diagnosis')
      .query({
        symptomsIds: ['1', '2'],
        gender: 'male',
        birthyear: '2000',
      });

    expect(response.status).toBe(200);
    expect(mockedGetDiagnosis).toHaveBeenCalledWith({
      symptomsIds: ['1', '2'],
      gender: 'male',
      birthyear: '2000',
    });
    expect(response.body).toEqual({ data: mockedDiagnosis });
  });

  it('should override gender & birthyear with users if nonexistent', async () => {
    const mockedDiagnosis: Diagnosis[] = [
      {
        Issue: {
          ID: 40,
          Name: 'Nasenbluten',
          ProfName: 'Epistaxis',
          Icd: 'A04.0',
          IcdName: 'Enteropathogenic Escherichia coli infection',
          Accuracy: 90,
        },
        Specialisation: [
          {
            ID: 15,
            Name: 'Allgemeinärzte',
            SpecialistID: 3,
          },
          {
            ID: 32,
            Name: 'Hals-Nasen-Ohrenärzte',
            SpecialistID: 49,
          },
        ],
      },
    ];

    mockedGetDiagnosis.mockResolvedValue(mockedDiagnosis);

    const response = await request(app)
      .get('/diagnosis')
      .query({
        symptomsIds: ['1', '2'],
      });

    expect(response.status).toBe(200);
    expect(mockedGetDiagnosis).toHaveBeenCalledWith({
      symptomsIds: ['1', '2'],
      gender: 'female',
      birthyear: '1990',
    });
    expect(response.body).toEqual({ data: mockedDiagnosis });
  });

  it('should handle errors and return an error response', async () => {
    const errorMessage = 'An error occurred';

    mockedGetDiagnosis.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get('/diagnosis');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
  });
});
