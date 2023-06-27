import { type Diagnosis } from '../../types/external/external-diagnosis';
import { type DiagnosisModel } from '../../types/models';

const transformDiagnosisResponse = (diagnoses: Diagnosis[]): DiagnosisModel[] =>
  diagnoses.map((diagnosis) => ({
    name: diagnosis.Issue.Name,
    accuracy: diagnosis.Issue.Accuracy,
    icd: diagnosis.Issue.Icd,
    icdName: diagnosis.Issue.IcdName,
    profName: diagnosis.Issue.ProfName,
    issueId: diagnosis.Issue.ID,
    specialisationIds: diagnosis.Specialisation.map(
      (specialisation) => specialisation.ID,
    ).join(','),
  })) as DiagnosisModel[];

export default transformDiagnosisResponse;
