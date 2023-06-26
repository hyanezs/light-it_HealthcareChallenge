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

export type { Diagnosis, Issue, Me, Symptom };
