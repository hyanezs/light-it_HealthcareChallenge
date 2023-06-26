import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { type DiagnosisRequest } from '../../../types';
import { getUsersDiagnosesHistory } from './api/get-history';

const HistoryScreen = () => {
  const [history, setHistory] = useState<DiagnosisRequest[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  const fetchHistory = async () => {
    setFetchingHistory(true);
    const response = await getUsersDiagnosesHistory();

    if (response) {
      setHistory(response.data);
    }

    setFetchingHistory(false);
  };

  useEffect(() => {
    void fetchHistory();
  }, []);

  return (
    <div className="flex flex-col mx-10">
      <span className="block text-center text-4xl leading-tight font-power-grotesk">
        Diagnoses History
      </span>
      <div className="flex flex-col gap-10 mt-10">
        {history.map((request, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 bg-backgroundDark border border-white border-opacity-10 rounded-lg p-4"
          >
            <div className="flex flex-row justify-between items-center">
              <span className="text-xl font-bold">Requested on:</span>
              <span className="text-sm font-semibold">{dayjs(request.requestedOn).toString()}</span>
            </div>
            {request.possibleDiagnoses.map((diagnosis, index) => (
              <div key={index} className="flex flex-col gap-4 mt-4">
                <span className="text-xl font-bold">Diagnosis {index + 1}:</span>
                <span className="text-lg font-semibold">{diagnosis.name}</span>
                <span className="text-lg font-semibold">Accuracy: {diagnosis.accuracy}</span>
                <span className="text-lg font-semibold">Specialisations:</span>
              </div>
            ))}
          </div>
        ))}
        {history.length === 0 && (
          <span className="text-xl font-semibold">No diagnoses history found.</span>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
