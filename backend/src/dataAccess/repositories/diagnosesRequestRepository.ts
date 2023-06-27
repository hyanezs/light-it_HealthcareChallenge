import { type Includeable } from 'sequelize';
import { type DiagnosesRequestModel } from '../../types/models';
import DiagnosesRequest from '../models/diagnosesRequest';

const persistDiagnosesRequest = async (
  diagnosesRequest: DiagnosesRequestModel,
): Promise<DiagnosesRequestModel> =>
  DiagnosesRequest.create(diagnosesRequest, {
    include: [
      {
        association: 'possibleDiagnoses',
      },
    ],
  });

const getDiagnosesRequestsByCondition = async <
  T extends Partial<DiagnosesRequestModel>,
>(
  where: T,
  include: Includeable | Includeable[] | undefined = [
    {
      all: true,
    },
  ],
): Promise<DiagnosesRequestModel[]> =>
  DiagnosesRequest.findAll({
    where,
    include,
  });

const getDiagnosesRequestByCondition = async <
  T extends Partial<DiagnosesRequestModel>,
>(
  where: T,
  include: string[] = [],
): Promise<DiagnosesRequestModel | null> =>
  DiagnosesRequest.findOne({
    where,
    include,
  });

const getDiagnosesRequestById = async (
  id: number,
  include: Includeable | Includeable[] | undefined = [
    {
      all: true,
    },
  ],
): Promise<DiagnosesRequestModel | null> =>
  DiagnosesRequest.findByPk(id, {
    include,
  });

export {
  getDiagnosesRequestByCondition,
  getDiagnosesRequestById,
  getDiagnosesRequestsByCondition,
  persistDiagnosesRequest,
};
