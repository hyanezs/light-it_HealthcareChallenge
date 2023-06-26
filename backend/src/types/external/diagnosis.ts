import { type Genders } from '../constants';

type GetDiagnosisParams = {
  symptomsIds: number[];
  gender: Genders;
  birthyear: number;
};

type Issue = {
  ID: number;
  Name: string;
  Accuracy: number;
  ProofName: string;
  Icd: string;
  IcdName: string;
};

type Specialisation = {
  ID: number;
  Name: string;
  SpecialistID: number;
};

type Diagnosis = {
  Issue: Issue;
  Specialisation: Specialisation[];
};

export type { Diagnosis, GetDiagnosisParams };
