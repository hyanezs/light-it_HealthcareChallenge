import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { SecondaryButton, Spinner } from '../../../components';
import { type DiagnosisRequest, type Symptom } from '../../../types';
import getSymptoms from '../diagnoses/api/get-symptoms';
import { getUsersDiagnosesHistory } from './api/get-history';
import DiagnosisRequestCard from './components/DiagnosisRequestCard';

type Filter = -1 | 0 | 1;

const HistoryScreen = () => {
  const [history, setHistory] = useState<DiagnosisRequest[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  const [sortDescending, setSortDescending] = useState(-1);
  const [filterBy, setFilterBy] = useState<Filter>(0);

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
      <section className="flex flex-row justify-center items-center gap-10">
        <SecondaryButton
          className="mt-10"
          onClick={() => {
            setSortDescending((prev) => (prev === 1 ? -1 : 1));
          }}
        >
          Sort by {sortDescending === -1 ? 'oldest' : 'newest'}
        </SecondaryButton>
        <div className="flex flex-row items-center gap-3">
          <SecondaryButton
            className="mt-10"
            onClick={() => {
              setSortDescending((prev) => (prev === 1 ? -1 : 1));
            }}
          >
            Filter by:
          </SecondaryButton>
          <select
            className="h-8 w-40 my-1 rounded-md pl-2 cursor-pointer"
            style={{
              backgroundColor: 'field',
            }}
            onChange={(e) => {
              setFilterBy(parseInt(e.target.value, 10) as Filter);
            }}
            value={filterBy}
          >
            <option value={0}>All</option>
            <option value={1}>Confirmed</option>
            <option value={-1}>Not Confirmed</option>
          </select>
        </div>
      </section>

      {fetchingHistory && (
        <div className="p-40 h-full w-full flex flex-row justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-cols-max gap-10 mt-10">
        {history
          .sort((a, b) => (dayjs(a.requestedOn).isBefore(b.requestedOn) ? -1 : 1) * sortDescending)
          .filter((request) => {
            if (filterBy === 1) return request.possibleDiagnoses.some((d) => d.confirmed);
            if (filterBy === -1) return !request.possibleDiagnoses.some((d) => d.confirmed);
            return true;
          })
          .map((request, index) => (
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
