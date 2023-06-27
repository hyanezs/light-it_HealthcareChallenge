import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HorizontalDivider, PrimaryButton, ProgressBar } from '../../../../components';
import { type DiagnosisRequest, type Symptom } from '../../../../types';
import { classNames } from '../../../../utils';
import RequestInfoDetails from './RequestInfoDetails';

type DiagnosisRequestCardProps = {
  request: DiagnosisRequest;
  symptoms: Symptom[];
};

const DiagnosisRequestCard = ({ request, symptoms }: DiagnosisRequestCardProps) => {
  const navigate = useNavigate();

  const isConfirmed = request.possibleDiagnoses.some((d) => d.confirmed);

  return (
    <div className="flex flex-col bg-backgroundDark border border-white border-opacity-10 rounded-lg p-4">
      <section>
        <div className="flex flex-row justify-between gap-10 items-center">
          <span className="text-2xl font-bold">Request #{request.id}</span>
          <PrimaryButton
            style={{
              padding: '0.5rem 1rem',
            }}
            onClick={() => {
              navigate(`/diagnoses/${request.id}`);
            }}
          >
            See details
          </PrimaryButton>
        </div>
        <RequestInfoDetails request={request} symptoms={symptoms} />
      </section>
      <HorizontalDivider
        style={{
          margin: '1rem 0',
        }}
      />
      <span className="text-xl font-semibold">Possible Diagnoses:</span>
      {request.possibleDiagnoses
        .sort((a, b) => b.accuracy - a.accuracy)
        .map((diagnosis) => (
          <div className="my-1" key={diagnosis.id}>
            <p
              className={classNames(
                isConfirmed
                  ? diagnosis.confirmed
                    ? 'text-green-200 font-semibold'
                    : 'text-gray-400'
                  : '',
                'text-md'
              )}
            >
              {diagnosis.name}
            </p>
            <ProgressBar progress={diagnosis.accuracy} size="small" />
          </div>
        ))}
    </div>
  );
};

export default DiagnosisRequestCard;
