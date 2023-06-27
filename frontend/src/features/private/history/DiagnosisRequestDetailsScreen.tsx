/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  HorizontalDivider,
  Modal,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  Spinner,
} from '../../../components';
import { type DiagnosisRequest, type Symptom } from '../../../types';
import getSymptoms from '../diagnoses/api/get-symptoms';
import getDiagnosisRequest from './api/get-diagnosis-request';
import updateDiagnosis from './api/update-diagnosis';
import RequestInfoDetails from './components/RequestInfoDetails';

const DiagnosisRequestDetailsScreen = () => {
  const [request, setRequest] = useState<DiagnosisRequest | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [fetchingRequest, setFetchingRequest] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmDiagnosisId, setConfirmDiagnosisId] = useState<number | undefined>(undefined);
  const [confirmingDiagnosis, setConfirmingDiagnosis] = useState(false);

  const { id } = useParams();

  const fetchRequest = useCallback(async () => {
    setFetchingRequest(true);

    if (!id) {
      toast.error('Invalid request id. Please check the url and try again.');
      setFetchingRequest(false);
      return;
    }

    const diagnosisRequestResponse = await getDiagnosisRequest(parseInt(id, 10));
    const symptomsResponse = await getSymptoms();

    if (diagnosisRequestResponse) {
      setRequest(diagnosisRequestResponse.data);
    } else {
      toast.error('Failed to fetch details. Please try again later.');
      setRequest(undefined);
    }

    if (symptomsResponse) {
      setSymptoms(symptomsResponse.data);
    } else {
      toast.error('Failed to fetch symptoms. Please try again later.');
      setSymptoms([]);
    }

    setFetchingRequest(false);
  }, [id]);

  useEffect(() => {
    void fetchRequest();
  }, [fetchRequest]);

  const auxLength = request?.symptomsIds.split(',').length ?? 0;

  const handleCancel = () => {
    setShowConfirmModal(false);
    setTimeout(() => {
      setConfirmDiagnosisId(undefined);
    }, 500);
  };

  const handleConfirm = async () => {
    if (!confirmDiagnosisId) {
      toast.error('Invalid diagnosis id. Please try again later.');
      return;
    }

    setConfirmingDiagnosis(true);

    const response = await updateDiagnosis(confirmDiagnosisId, {
      confirmed: true,
    });

    if (response) {
      toast.success('Diagnosis confirmed successfully.');
      setRequest(undefined);
      void fetchRequest();
    } else {
      toast.error('Failed to confirm diagnosis. Please try again later.');
    }

    setConfirmingDiagnosis(false);
    setShowConfirmModal(false);
    setTimeout(() => {
      setConfirmDiagnosisId(undefined);
    }, 500);
  };

  const isConfirmed = request?.possibleDiagnoses?.some((d) => d.confirmed);

  const confirmModalBody = (
    <div className="flex flex-col gap-10 w-full h-full">
      <p className="text-xl font-semibold ">
        Was this diagnosis correct for symptom
        {auxLength > 1 ? 's' : ''}:{' '}
        {request?.symptomsIds
          .split(',')
          .map((id) => symptoms.find((s) => s.ID === parseInt(id, 10))?.Name)}
        ?
      </p>
      <div className="flex flex-row justify-center gap-10">
        <PrimaryButton
          style={{
            padding: '0.5rem 1rem',
          }}
          onClick={handleConfirm}
          disabled={confirmingDiagnosis}
          loading={confirmingDiagnosis}
        >
          Confirm
        </PrimaryButton>
        <SecondaryButton
          style={{
            padding: '0.5rem 1rem',
          }}
          onClick={handleCancel}
          disabled={confirmingDiagnosis}
        >
          Cancel
        </SecondaryButton>
      </div>
    </div>
  );

  const confirmModalTitle = `Confirm Diagnosis: ${
    request?.possibleDiagnoses.find((d) => d.id === confirmDiagnosisId)?.name ?? ''
  }`;

  return (
    <div>
      <Modal
        isOpen={showConfirmModal}
        close={() => {
          setShowConfirmModal(false);
        }}
        body={confirmModalBody}
        title={confirmModalTitle}
      />
      <span className="block text-center text-4xl leading-tight font-power-grotesk">
        Diagnosis Request #{id} Details
      </span>
      <div className="flex flex-col gap-10 m-10">
        {request && (
          <div className="flex flex-col gap-10 w-full h-full">
            <p className="text-2xl font-semibold ">Are you feeling any better?</p>
          </div>
        )}
        {fetchingRequest && (
          <div className="p-20 h-full w-full flex flex-row justify-center items-center">
            <Spinner />
          </div>
        )}
        {request && (
          <div className="flex flex-col gap-10 w-full h-full">
            <section className="max-w-lg">
              <RequestInfoDetails request={request} symptoms={symptoms} />
            </section>
            <HorizontalDivider
              style={{
                margin: '1rem 0',
              }}
            />
            <section className="flex flex-row justify-between">
              <span className="text-xl font-bold">
                {request.possibleDiagnoses.length ? 'Possible Diagnoses:' : 'No diagnosis'}
              </span>
              {isConfirmed || !request.possibleDiagnoses.length ? (
                <div />
              ) : (
                <span className="text-xl font-bold">Tell us, which diagnosis was correct?</span>
              )}
            </section>
            {request.possibleDiagnoses
              .sort((a, b) => b.accuracy - a.accuracy)
              .sort((a) => (a.confirmed ? -1 : 1))
              .map((diagnosis) => (
                <div className="my-1 flex flex-col w-full" key={diagnosis.id}>
                  <p className="mb-2 text-lg font-semibold">{diagnosis.name}</p>
                  <div className="flex flex-row items-center justify-between gap-20">
                    <ProgressBar progress={diagnosis.accuracy} />
                    {isConfirmed ? (
                      diagnosis.confirmed && (
                        <span className="text-xl text-green-200 font-semibold">Confirmed</span>
                      )
                    ) : (
                      <PrimaryButton
                        style={{
                          padding: '0.5rem 1rem',
                        }}
                        onClick={() => {
                          setShowConfirmModal(true);
                          setConfirmDiagnosisId(diagnosis.id);
                        }}
                        disabled={confirmingDiagnosis}
                        loading={confirmingDiagnosis && confirmDiagnosisId === diagnosis.id}
                      >
                        Confirm
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisRequestDetailsScreen;
