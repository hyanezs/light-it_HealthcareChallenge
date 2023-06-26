import request from 'supertest';
import { getPossibleDiagnoses } from '../../logic/diagnosesLogic';
import { app } from '../../server';
import { Diagnosis } from '../../types/external/external-diagnosis';

jest.mock('../../logic/diagnosesLogic');

describe('GET /diagnoses', () => {
  const mockedGetPossibleDiagnoses = getPossibleDiagnoses as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user = {
    birthdate: '1990-01-01',
    email: '  ',
    firstName: 'Carly',
    gender: 2,
    id: 1,
    lastName: 'Doe',
  };

  it('should return a valid response with diagnoses', async () => {
    const mockedDiagnoses: Diagnosis[] = [
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

    mockedGetPossibleDiagnoses.mockResolvedValue(mockedDiagnoses);

    const response = await request(app)
      .get('/diagnoses')
      .query({
        symptomsIds: ['1', '2'],
        gender: 'male',
        birthyear: '2000',
      });

    expect(response.status).toBe(200);
    expect(mockedGetPossibleDiagnoses).toHaveBeenCalledWith(
      {
        symptomsIds: ['1', '2'],
        gender: 'male',
        birthyear: '2000',
      },
      user,
    );
    expect(response.body).toEqual({ data: mockedDiagnoses });
  });

  it('should override gender & birthyear with users if nonexistent', async () => {
    const mockedDiagnoses: Diagnosis[] = [
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

    mockedGetPossibleDiagnoses.mockResolvedValue(mockedDiagnoses);

    const response = await request(app)
      .get('/diagnoses')
      .query({
        symptomsIds: ['1', '2'],
      });

    expect(response.status).toBe(200);
    expect(mockedGetPossibleDiagnoses).toHaveBeenCalledWith(
      {
        symptomsIds: ['1', '2'],
        gender: 'female',
        birthyear: '1990',
      },
      user,
    );
    expect(response.body).toEqual({ data: mockedDiagnoses });
  });

  it('should handle errors and return an error response', async () => {
    const errorMessage = 'An error occurred';

    mockedGetPossibleDiagnoses.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get('/diagnoses');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
  });
});
