import React, { useEffect, useState } from 'react';
import { PrimaryButton, VirtualizedMultiSelect } from '../../../components';
import { type Option, type Symptom } from '../../../types';
import getSymptoms from './api/fetch-symptoms';

const DiagnosisScreen = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Option[]>([]);
  const [fetchingSymptoms, setFetchingSymptoms] = useState(false);

  const fetchSymptoms = async () => {
    setFetchingSymptoms(true);
    const response = await getSymptoms();

    if (response) {
      setSymptoms(response.data);
    } else {
      setSymptoms([]);
    }

    setFetchingSymptoms(false);
  };

  useEffect(() => {
    void fetchSymptoms();
  }, []);

  return (
    <div className="flex flex-col mx-10">
      <span className="block text-center text-4xl leading-tight font-power-grotesk">
        Symptoms Evaluation
      </span>
      <div className="flex flex-row justify-between mt-20 gap-40">
        <div className="flex flex-col gap-10 w-full">
          <p className="text-xl">Please select your current symptoms:</p>
          <VirtualizedMultiSelect
            options={symptoms.map((symptom) => ({ label: symptom.Name, value: symptom.ID }))}
            loading={fetchingSymptoms}
            placeholder="Select Symptoms"
            isSearchable={true}
            value={selectedSymptoms}
            onChange={(newSymptoms) => {
              console.log({ newSymptoms });
              setSelectedSymptoms(newSymptoms as Option[]);
            }}
          />
          <PrimaryButton>Request Diagnosis</PrimaryButton>
        </div>
        <div className="flex flex-col gap-10 w-full">
          <p className="text-xl font-semibold">Diagnosis Results</p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisScreen;
