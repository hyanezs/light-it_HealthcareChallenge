import { BadRequestError } from '../../../exceptions';
import { Genders } from '../../../types';
import { GetDiagnosisParams } from '../../../types/requests';
import { validateGetDiagnosisParams } from '../../../validations';

describe('validateGetDiagnosisParams', () => {
  it('should return gracefully on valid payload', () => {
    const params: GetDiagnosisParams = {
      birthyear: '2000',
      gender: 'male',
      symptomsIds: ['1', '2'],
    };

    const result = validateGetDiagnosisParams(params);

    expect(result).toBeUndefined();
  });

  it('should return BadRequestError on missing sypmtomsIds', () => {
    const params = {
      birthyear: '2000',
      gender: 'male',
    };

    expect(() => {
      validateGetDiagnosisParams(params as GetDiagnosisParams);
    }).toThrow(new BadRequestError('queryParam: symptomsIds is required'));
  });

  it('should return BadRequestError on invalid symptomsIds type', () => {
    const params = {
      birthyear: '2000',
      gender: 'male',
      symptomsIds: '1',
    };

    expect(() => {
      validateGetDiagnosisParams(params as unknown as GetDiagnosisParams);
    }).toThrow(new BadRequestError('queryParam: symptomsIds must be an array'));
  });

  it('should return BadRequestError on empty symptomsIds', () => {
    const params = {
      birthyear: '2000',
      gender: 'male',
      symptomsIds: [],
    };

    expect(() => {
      validateGetDiagnosisParams(params as unknown as GetDiagnosisParams);
    }).toThrow(
      new BadRequestError('queryParam: symptomsIds must not be empty'),
    );
  });

  it('should return BadRequestError on invalid symptomsIds', () => {
    const params = {
      birthyear: '2000',
      gender: 'male',
      symptomsIds: ['a'],
    };

    expect(() => {
      validateGetDiagnosisParams(params as unknown as GetDiagnosisParams);
    }).toThrow(
      new BadRequestError(
        'queryParam: symptomsIds must be an array of positive numbers',
      ),
    );
  });

  it('should return BadRequestError on invalid symptomsIds', () => {
    const params = {
      birthyear: '2000',
      gender: 'male',
      symptomsIds: ['-1'],
    };

    expect(() => {
      validateGetDiagnosisParams(params as unknown as GetDiagnosisParams);
    }).toThrow(
      new BadRequestError(
        'queryParam: symptomsIds must be an array of positive numbers',
      ),
    );
  });

  it('should return BadRequestError on invalid gender', () => {
    const params = {
      birthyear: '2000',
      gender: 'a',
      symptomsIds: ['1'],
    };

    expect(() => {
      validateGetDiagnosisParams(params as unknown as GetDiagnosisParams);
    }).toThrow(
      new BadRequestError(
        `queryParam: Gender - a is invalid. Needs to be one of: ${Object.values(
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
      symptomsIds: ['1'],
    };

    expect(() => {
      validateGetDiagnosisParams(params as unknown as GetDiagnosisParams);
    }).toThrow(
      new BadRequestError('queryParam: birthyear must be a valid year'),
    );
  });

  it('should return BadRequestError on invalid year', () => {
    const params = {
      birthyear: 'a',
      gender: 'male',
      symptomsIds: ['1'],
    };

    expect(() => {
      validateGetDiagnosisParams(params as unknown as GetDiagnosisParams);
    }).toThrow(
      new BadRequestError('queryParam: birthyear must be a valid year'),
    );
  });
});
