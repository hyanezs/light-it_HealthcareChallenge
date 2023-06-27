import { Genders } from '../types';

const getGenderFromString = (gender: string): Genders | undefined =>
  Genders[gender.toUpperCase() as keyof typeof Genders];

export default getGenderFromString;
