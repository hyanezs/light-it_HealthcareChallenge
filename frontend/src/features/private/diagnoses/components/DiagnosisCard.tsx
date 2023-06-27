import React from 'react';
import { InfoButton, ProgressBar } from '../../../../components';
import { type Diagnosis } from '../../../../types';

type DiagnosisCardProps = {
  diagnosis: Diagnosis;
  handleOpenInfo: (diagnosis: Diagnosis) => void;
};

const DiagnosisCard = ({ diagnosis, handleOpenInfo }: DiagnosisCardProps) => (
  <div className="flex flex-col gap-10 w-full">
    <section className="flex flex-row justify-between items-center">
      <p className="text-xl font-bold">{diagnosis.Issue.Name}</p>
      <InfoButton
        onClick={() => {
          handleOpenInfo(diagnosis);
        }}
      />
    </section>
    <div className="flex flex-row gap-4 items-center">
      Accuracy: <ProgressBar progress={diagnosis.Issue.Accuracy} />
    </div>
  </div>
);

export default DiagnosisCard;
