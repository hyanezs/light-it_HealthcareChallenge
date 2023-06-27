import { BadRequestError } from '../../../exceptions';
import { Genders } from '../../../types';
import { GetDiagnosesReqBody } from '../../../types/requests';
import { validateGetPossibleDiagnosesReqBody } from '../../../validations';

describe('validateGetPossibleDiagnosesReqBody', () => {
  it('should return gracefully on valid payload', () => {
    const params: GetDiagnosesReqBody = {
      birthyear: '2000',
      gender: 'male',
      symptomsIds: [1, 2],
    };

    const result = validateGetPossibleDiagnosesReqBody(params);

    expect(result).toBeUndefined();
  });

  it('should return BadRequestError on missing sypmtomsIds', () => {
    const params = {
      birthyear: '2000',
      gender: 'male',
    };

    expect(() => {
      validateGetPossibleDiagnosesReqBody(params as GetDiagnosesReqBody);
    }).toThrow(new BadRequestError('payload error: symptomsIds is required'));
  });

  it('should return BadRequestError on invalid symptomsIds type', () => {
    const params = {
      birthyear: '2000',
      gender: 'male',
      symptomsIds: 1,
    };

    expect(() => {
      validateGetPossibleDiagnosesReqBody(
        params as unknown as GetDiagnosesReqBody,
      );
    }).toThrow(
      new BadRequestError('payload error: symptomsIds must be an array'),
    );
  });

  it('should return BadRequestError on empty symptomsIds', () => {
    const params = {
      birthyear: '2000',
      gender: 'male',
      symptomsIds: [],
    };

    expect(() => {
      validateGetPossibleDiagnosesReqBody(
        params as unknown as GetDiagnosesReqBody,
      );
    }).toThrow(
      new BadRequestError('payload error: symptomsIds must not be empty'),
    );
  });


  it('should return BadRequestError on invalid symptomsIds', () => {
    const params = {
      birthyear: '2000',
      gender: 'male',
      symptomsIds: [-1],
    };

    expect(() => {
      validateGetPossibleDiagnosesReqBody(
        params as unknown as GetDiagnosesReqBody,
      );
    }).toThrow(
      new BadRequestError(
        'payload error: symptomsIds must be an array of positive numbers',
      ),
    );
  });

  it('should return BadRequestError on invalid gender', () => {
    const params = {
      birthyear: '2000',
      gender: 'a',
      symptomsIds: [1],
    };

    expect(() => {
      validateGetPossibleDiagnosesReqBody(
        params as unknown as GetDiagnosesReqBody,
      );
    }).toThrow(
      new BadRequestError(
        `payload error: Gender - a is invalid. Needs to be one of: ${Object.values(
          Genders,
        )
          .filter((g) => typeof g === 'string')
          .join(', ')
          .toLowerCase()}.`,
      ),
    );
  });

  it('should return BadRequestError on invalid year', () => {
    const params = {
      birthyear: '190',
      gender: 'male',
      symptomsIds: [1],
    };

    expect(() => {
      validateGetPossibleDiagnosesReqBody(
        params as unknown as GetDiagnosesReqBody,
      );
    }).toThrow(
      new BadRequestError('payload error: birthyear must be a valid year'),
    );
  });

  it('should return BadRequestError on invalid year', () => {
    const params = {
      birthyear: 'a',
      gender: 'male',
      symptomsIds: [1],
    };

    expect(() => {
      validateGetPossibleDiagnosesReqBody(
        params as unknown as GetDiagnosesReqBody,
      );
    }).toThrow(
      new BadRequestError('payload error: birthyear must be a valid year'),
    );
  });
});
