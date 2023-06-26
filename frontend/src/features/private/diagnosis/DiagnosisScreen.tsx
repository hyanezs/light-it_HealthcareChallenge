import React, { useState } from 'react';
import { HorizontalDivider } from '../../../components';
import { type Diagnosis } from '../../../types';
import RequestDiagnosisForm from './components/RequestDiagnosisForm';
import './diagnosis.css';

const DiagnosisScreen = () => {
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);

  return (
    <div className="flex flex-col mx-10">
      <span className="block text-center text-4xl leading-tight font-power-grotesk">
        Symptoms Evaluation
      </span>
      <div className="flex flex-col lg:flex-row justify-between mt-20 gap-10 lg:gap-40">
        <RequestDiagnosisForm setDiagnosis={setDiagnosis} />
        <HorizontalDivider id="mobile-divider" />
        <div className="flex flex-col gap-10 w-full">
          <p className="text-xl font-semibold">Diagnosis Results</p>
          Dd H V
        </div>
      </div>
    </div>
  );
};

export default DiagnosisScreen;
