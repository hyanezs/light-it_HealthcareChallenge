type GetDiagnosisParams = {
  symptomsIds: string[];
  gender: string;
  birthyear: string;
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

export type { Diagnosis, GetDiagnosisParams };
