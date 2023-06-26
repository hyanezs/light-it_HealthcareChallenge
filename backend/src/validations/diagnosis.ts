import dayjs from 'dayjs';
import { BadRequestError } from '../exceptions';
import { Genders } from '../types';
import { type GetDiagnosisParams } from '../types/requests';

const validateGetDiagnosisParams = (params: GetDiagnosisParams) => {
  if (!params.symptomsIds) {
    throw new BadRequestError('queryParam: symptomsIds is required');
  }

  if (!Array.isArray(params.symptomsIds)) {
    throw new BadRequestError('queryParam: symptomsIds must be an array');
  }

  if (params.symptomsIds.length === 0) {
    throw new BadRequestError('queryParam: symptomsIds must not be empty');
  }

  const sypmtomsIdsNumbers = params.symptomsIds.map((id) => parseInt(id, 10));

  if (sypmtomsIdsNumbers.some((id) => Number.isNaN(id) || id < 1)) {
    throw new BadRequestError(
      'queryParam: symptomsIds must be an array of positive numbers',
    );
  }

  if (
    !Object.values(Genders).includes(
      params.gender.toString().toUpperCase() as any as Genders,
    )
  ) {
    throw new BadRequestError(
      `queryParam: Gender - ${
        params.gender
      } is invalid. Needs to be one of: ${Object.values(Genders)
        .filter((g) => typeof g === 'string')
        .join(', ')
        .toLowerCase()}.`,
    );
  }

  const year = parseInt(params.birthyear, 10);

  // Ballpark check for valid year (not too far in the past)
  if (Number.isNaN(year) || year < dayjs().year() - 120) {
    throw new BadRequestError('queryParam: birthyear must be a valid year');
  }
};

export { validateGetDiagnosisParams };
