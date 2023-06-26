import React from 'react';
import { HorizontalDivider } from '../../../../components';
import { type Diagnosis } from '../../../../types';
import DiagnosisCard from './DiagnosisCard';

type DiagnosesViewProps = {
  diagnoses: Diagnosis[];
};

const DiagnosesView = ({ diagnoses }: DiagnosesViewProps) => (
  <div className="flex flex-col w-full mb-20">
    <p className="text-2xl font-semibold mb-10">Diagnosis Results</p>
    {diagnoses
      .sort(({ Issue: a }, { Issue: b }) => b.Accuracy - a.Accuracy)
      .map((diagnosis, index) => (
        <section key={index}>
          <DiagnosisCard diagnosis={diagnosis} />
          {index !== diagnoses.length - 1 && <HorizontalDivider />}
        </section>
      ))}
  </div>
);

export default DiagnosesView;
