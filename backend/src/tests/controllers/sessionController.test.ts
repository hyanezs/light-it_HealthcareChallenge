import request from 'supertest';
import { BadRequestError } from '../../exceptions';
import { login, register } from '../../logic/sessionLogic';
import { app } from '../../server';
import { StatusCodes } from '../../types';

jest.mock('../../logic/sessionLogic');
describe('POST /auth/login', () => {
  const mockedLogin = login as jest.Mock;

  const validPostPayload = {
    email: 'hyanez@gmail.com',
    password: 'Password123',
  };

  const invalidPayload = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return a 200-OK code with a token in cookies for valid payload', async () => {
    mockedLogin.mockResolvedValue('avalidjwttoken');

    const res = await request(app).post('/auth/login').send(validPostPayload);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie']).toStrictEqual([
      'token=avalidjwttoken; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict',
    ]);
    expect(mockedLogin).toHaveBeenCalledWith('hyanez@gmail.com', 'Password123');
    expect(mockedLogin).toHaveBeenCalledTimes(1);
  });

  test('should throw error back to controller for an invalid payload', async () => {
    const sampleError = 'email is required';
    mockedLogin.mockImplementation(() => {
      throw new BadRequestError(sampleError);
    });

    const res = await request(app).post('/auth/login').send(invalidPayload);

    expect(res.body.error).toBe(sampleError);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(mockedLogin).toHaveBeenCalledTimes(1);
  });
});

describe('POST /auth/register', () => {
  const mockedRegister = register as jest.Mock;

  const validPostPayload = {
    firstName: 'Hernan',
    lastName: 'Yanez',
    gender: 'male',
    birthdate: '02/12/2000',
    email: 'hyanez@gmail.com',
    password: 'Password123',
  };

  const invalidPayload = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return a 200-OK code with a token in cookies for valid payload', async () => {
    mockedRegister.mockResolvedValue('avalidjwttoken');

    const res = await request(app)
      .post('/auth/register')
      .send(validPostPayload);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie']).toStrictEqual([
      'token=avalidjwttoken; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict',
    ]);
    expect(mockedRegister).toHaveBeenCalledWith({
      firstName: 'Hernan',
      lastName: 'Yanez',
      gender: 'male',
      birthdate: '02/12/2000',
      email: 'hyanez@gmail.com',
      password: 'Password123',
      requestTimestamp: expect.any(Number),
    });
    expect(mockedRegister).toHaveBeenCalledTimes(1);
  });

  test('should throw error back to controller for an invalid payload', async () => {
    const sampleError = 'email is required';
    mockedRegister.mockImplementation(() => {
      throw new BadRequestError(sampleError);
    });

    const res = await request(app).post('/auth/register').send(invalidPayload);

    expect(res.body.error).toBe(sampleError);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(mockedRegister).toHaveBeenCalledTimes(1);
  });
});

describe('POST /auth/logout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return a 200-OK code with a reset-cookie request', async () => {
    const res = await request(app).post('/auth/logout').send({});

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.headers['set-cookie']).toBeDefined();
  });
});
