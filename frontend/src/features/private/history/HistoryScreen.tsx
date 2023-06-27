import React, { useEffect, useState } from 'react';
import { Spinner } from '../../../components';
import { type DiagnosisRequest, type Symptom } from '../../../types';
import getSymptoms from '../diagnoses/api/get-symptoms';
import { getUsersDiagnosesHistory } from './api/get-history';
import DiagnosisRequestCard from './components/DiagnosisRequestCard';

const HistoryScreen = () => {
  const [history, setHistory] = useState<DiagnosisRequest[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  const fetchHistory = async () => {
    setFetchingHistory(true);
    const historyResponse = await getUsersDiagnosesHistory();
    const symptomsResponse = await getSymptoms();

    if (historyResponse) {
      setHistory(historyResponse.data);
    } else {
      setHistory([]);
    }

    if (symptomsResponse) {
      setSymptoms(symptomsResponse.data);
    } else {
      setSymptoms([]);
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
      {fetchingHistory && (
        <div className="p-40 h-full w-full flex flex-row justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-cols-max gap-10 mt-10">
        {history.map((request, index) => (
          <DiagnosisRequestCard key={index} symptoms={symptoms} request={request} />
        ))}
        {history.length === 0 && !fetchingHistory && (
          <span className="text-xl font-semibold">No diagnoses history found.</span>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
