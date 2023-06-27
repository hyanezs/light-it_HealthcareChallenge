import {
  getDiagnosesRequestByCondition,
  getDiagnosesRequestById,
  getDiagnosesRequestsByCondition,
  persistDiagnosesRequest,
} from './diagnosesRequestRepository';
import { updateDiagnosis } from './diagnosisRepository';
import { getUserByCondition, getUserById, persistUser } from './userRepository';

export {
  getDiagnosesRequestByCondition,
  getDiagnosesRequestById,
  getDiagnosesRequestsByCondition,
  getUserByCondition,
  getUserById,
  persistDiagnosesRequest,
  persistUser,
  updateDiagnosis,
};
