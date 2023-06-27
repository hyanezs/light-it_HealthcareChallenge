import dayjs from 'dayjs';
import { BadRequestError } from '../exceptions';
import { Genders } from '../types';
import { type GetDiagnosesReqBody } from '../types/requests';

const validateGetPossibleDiagnosesReqBody = (params: GetDiagnosesReqBody) => {
  if (!params.symptomsIds) {
    throw new BadRequestError('payload error: symptomsIds is required');
  }

  if (!Array.isArray(params.symptomsIds)) {
    throw new BadRequestError('payload error: symptomsIds must be an array');
  }

  if (params.symptomsIds.length === 0) {
    throw new BadRequestError('payload error: symptomsIds must not be empty');
  }

  if (params.symptomsIds.some((id) => Number.isNaN(id) || id < 1)) {
    throw new BadRequestError(
      'payload error: symptomsIds must be an array of positive numbers',
    );
  }

  if (
    !Object.values(Genders).includes(
      params.gender.toString().toUpperCase() as any as Genders,
    )
  ) {
    throw new BadRequestError(
      `payload error: Gender - ${
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
    throw new BadRequestError('payload error: birthyear must be a valid year');
  }
};

export { validateGetPossibleDiagnosesReqBody };
