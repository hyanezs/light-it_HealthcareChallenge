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

  const modalTitle = <p>Diagnosis: {selectedDiagnosisInfo?.Issue?.Name}</p>;

  const modalBody = (
    <table className="table-auto">
      <tbody>
        {issueInfoFields.map((field) => (
          <tr key={field} className="text-left">
            <td className="font-bold p-2 align-top">{field}:</td>
            <td className="row-content py-2 px-6">
              {selectedDiagnosisInfo?.Issue[field as keyof Issue] ??
                selectedDiagnosisInfo?.Specialisation.map((s) => s.Name).join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
      {diagnoses.length === 0 && <p className="text-xl font-semibold">No results found.</p>}
    </div>
  );
};

export default DiagnosesView;
