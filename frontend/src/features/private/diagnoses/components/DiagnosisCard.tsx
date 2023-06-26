import React from 'react';
import { ProgressBar } from '../../../../components';
import { type Diagnosis } from '../../../../types';

type DiagnosisCardProps = {
  diagnosis: Diagnosis;
};

const DiagnosisCard = ({ diagnosis }: DiagnosisCardProps) => (
  <div className="flex flex-col gap-10 w-full">
    <p className="text-xl font-bold">{diagnosis.Issue.Name}</p>
    <div className="flex flex-row gap-4 items-center">
      Accuracy: <ProgressBar progress={diagnosis.Issue.Accuracy} />
    </div>
  </div>
);

export default DiagnosisCard;
