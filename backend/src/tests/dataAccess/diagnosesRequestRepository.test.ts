import DiagnosesRequest from '../../dataAccess/models/diagnosesRequest';
import {
  getDiagnosesRequestByCondition,
  getDiagnosesRequestById,
  getDiagnosesRequestsByCondition,
  persistDiagnosesRequest,
} from '../../dataAccess/repositories';
import { Genders } from '../../types';
import { DiagnosesRequestModel } from '../../types/models';

const validDiagnosesRequest: Partial<DiagnosesRequestModel> = {
  symptomsIds: '1,2',
  birthyear: 2000,
  gender: Genders.FEMALE,
  requestedOn: new Date(),
  possibleDiagnoses: [],
  userId: 1,
};

const diagnosesRequestInDb: Partial<DiagnosesRequestModel> = {
  id: 1,
  symptomsIds: '1,2',
  birthyear: 2000,
  gender: Genders.FEMALE,
  requestedOn: new Date(),
  possibleDiagnoses: [],
  userId: 1,
};

describe('persistDiagnosesRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should persist a user and return the created user model', async () => {
    jest
      .spyOn(DiagnosesRequest, 'create')
      .mockResolvedValueOnce(diagnosesRequestInDb);
    const result = await persistDiagnosesRequest(
      validDiagnosesRequest as DiagnosesRequestModel,
    );
    expect(result).toBe(diagnosesRequestInDb);
    expect(DiagnosesRequest.create).toHaveBeenCalledWith(
      validDiagnosesRequest,
      {
        include: [{ association: 'possibleDiagnoses' }],
      },
    );
  });

  it('should throw an error when user persistence fails', async () => {
    const error = new Error('Persistence error');
    jest.spyOn(DiagnosesRequest, 'create').mockRejectedValueOnce(error);
    await expect(
      persistDiagnosesRequest(validDiagnosesRequest as DiagnosesRequestModel),
    ).rejects.toThrow(error);
    expect(DiagnosesRequest.create).toHaveBeenCalledWith(
      validDiagnosesRequest,
      { include: [{ association: 'possibleDiagnoses' }] },
    );
  });
});

describe('getDiagnosesRequestById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve a diagnoses request by id', async () => {
    jest
      .spyOn(DiagnosesRequest, 'findByPk')
      .mockResolvedValueOnce(diagnosesRequestInDb as DiagnosesRequestModel);

    const result = await getDiagnosesRequestById(1);

    expect(result).toBe(diagnosesRequestInDb);
    expect(DiagnosesRequest.findByPk).toHaveBeenCalledWith(1, {
      include: [{ all: true }],
    });
  });

  it('should return null when no request is found for given id', async () => {
    jest.spyOn(DiagnosesRequest, 'findByPk').mockResolvedValueOnce(null);

    const result = await getDiagnosesRequestById(1);

    expect(result).toBeNull();
    expect(DiagnosesRequest.findByPk).toHaveBeenCalledWith(1, {
      include: [{ all: true }],
    });
  });
});

describe('getDiagnosesRequestByCondition', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve a diagnoses request by condition', async () => {
    const condition = {
      userId: 1,
    };

    jest
      .spyOn(DiagnosesRequest, 'findOne')
      .mockResolvedValueOnce(diagnosesRequestInDb as DiagnosesRequestModel);

    const result = await getDiagnosesRequestByCondition(condition);

    expect(result).toBe(diagnosesRequestInDb);
    expect(DiagnosesRequest.findOne).toHaveBeenCalledWith({
      where: condition,
      include: [],
    });
  });

  it('should return null when no request is found by condition', async () => {
    const condition = {
      userId: 1,
    };

    jest.spyOn(DiagnosesRequest, 'findOne').mockResolvedValueOnce(null);

    const result = await getDiagnosesRequestByCondition(condition);

    expect(result).toBeNull();
    expect(DiagnosesRequest.findOne).toHaveBeenCalledWith({
      where: condition,
      include: [],
    });
  });
});

describe('getDiagnosesRequestsByCondition', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve diagnoses requests by condition', async () => {
    const condition = {
      userId: 1,
    };

    jest
      .spyOn(DiagnosesRequest, 'findAll')
      .mockResolvedValueOnce([diagnosesRequestInDb] as DiagnosesRequestModel[]);

    const result = await getDiagnosesRequestsByCondition(condition);

    expect(result).toStrictEqual([diagnosesRequestInDb]);
    expect(DiagnosesRequest.findAll).toHaveBeenCalledWith({
      where: condition,
      include: [
        {
          association: 'possibleDiagnoses',
        },
      ],
    });
  });

  it('should return empty array when no requests are found by condition', async () => {
    const condition = {
      userId: 1,
    };

    jest.spyOn(DiagnosesRequest, 'findAll').mockResolvedValueOnce([]);

    const result = await getDiagnosesRequestsByCondition(condition);

    expect(result).toStrictEqual([]);
    expect(DiagnosesRequest.findAll).toHaveBeenCalledWith({
      where: condition,
      include: [
        {
          association: 'possibleDiagnoses',
        },
      ],
    });
  });
});
