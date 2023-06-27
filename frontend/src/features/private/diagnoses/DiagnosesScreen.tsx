import React, { useState } from 'react';
import { HorizontalDivider } from '../../../components';
import { type Diagnosis } from '../../../types';
import DiagnosesView from './components/DiagnosesView';
import RequestDiagnosesForm from './components/RequestDiagnosesForm';
import './diagnoses.css';

const DiagnosesScreen = () => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleDiagnosesChange = (diagnoses: Diagnosis[]) => {
    setDiagnoses(diagnoses);
    setShowResults(true);
  };

  return (
    <div className="flex flex-col mx-10">
      <span className="block text-center text-4xl leading-tight font-power-grotesk">
        Symptoms Evaluation
      </span>
      <div className="flex flex-col lg:flex-row justify-between mt-20 gap-10 lg:gap-40">
        <RequestDiagnosesForm setDiagnoses={handleDiagnosesChange} />
        <HorizontalDivider id="mobile-divider" />
        {showResults ? <DiagnosesView diagnoses={diagnoses} /> : <div className="w-full" />}
      </div>
    </div>
  );
};

export default DiagnosesScreen;
