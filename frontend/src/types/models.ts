import { type Genders } from './constants';

type Me = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
};

type Symptom = {
  ID: number;
  Name: string;
};

type Issue = {
  ID: number;
  Name: string;
  Accuracy: number;
  ProfName: string;
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

type PossibleDiagnosis = {
  issueId: number;
  name: string;
  accuracy: number;
  profName: string;
  icd: string;
  icdName: string;
  specialisationIds: string;
  confirmed: boolean;
  id: number;
};

type DiagnosisRequest = {
  id: number;
  requestedOn: Date;
  possibleDiagnoses: PossibleDiagnosis[];
  user: Me;
  userId: number;
  birthyear: number;
  gender: Genders;
  symptomsIds: string;
};

export type { Diagnosis, DiagnosisRequest, Issue, Me, Symptom };
