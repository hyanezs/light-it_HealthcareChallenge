import React, { useState } from 'react';
import { HorizontalDivider, Modal } from '../../../../components';
import { type Diagnosis, type Issue } from '../../../../types';
import DiagnosisCard from './DiagnosisCard';

type DiagnosesViewProps = {
  diagnoses: Diagnosis[];
};

const DiagnosesView = ({ diagnoses }: DiagnosesViewProps) => {
  const [selectedDiagnosisInfo, setSelectedDiagnosisInfo] = useState<Diagnosis | undefined>(
    undefined
  );
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleOpenInfoModal = (diagnosis?: Diagnosis) => {
    setSelectedDiagnosisInfo(diagnosis);
    setShowInfoModal(true);
  };

  const issueInfoFields = ['Icd', 'IcdName', 'Accuracy', 'ProfName', 'Specialisations'];

  const modalTitle = <p>{selectedDiagnosisInfo?.Issue?.Name}</p>;

  const modalBody = (
    <div className="flex flex-row gap-10 w-full">
      <div className="flex flex-col items-start">
        {issueInfoFields.map((field) => (
          <span className="font-bold" key={field}>
            {field}:
          </span>
        ))}
      </div>
      <div className="flex flex-col items-start">
        {issueInfoFields.map((field) => (
          <span key={field}>
            {selectedDiagnosisInfo?.Issue[field as keyof Issue] ??
              selectedDiagnosisInfo?.Specialisation.map((s) => s.Name).join(', ')}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full mb-20">
      <Modal
        body={modalBody}
        title={modalTitle}
        isOpen={showInfoModal}
        close={() => {
          setShowInfoModal(false);
        }}
      />
      <p className="text-2xl font-semibold mb-10">Diagnosis Results</p>
      {diagnoses
        .sort(({ Issue: a }, { Issue: b }) => b.Accuracy - a.Accuracy)
        .map((diagnosis, index) => (
          <section key={index}>
            <DiagnosisCard diagnosis={diagnosis} handleOpenInfo={handleOpenInfoModal} />
            {index !== diagnoses.length - 1 && <HorizontalDivider />}
          </section>
        ))}
    </div>
  );
};

export default DiagnosesView;
