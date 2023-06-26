import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PrimaryButton, VirtualizedMultiSelect } from '../../../../components';
import { type Diagnosis, type Option, type Symptom } from '../../../../types';
import { Genders } from '../../../../types/constants';
import { getDiagnosis, type GetDiagnosisParams } from '../api/get-diagnosis';
import getSymptoms from '../api/get-symptoms';

type RequestDiagnosisFormProps = {
  setDiagnosis: (diagnosis: Diagnosis[]) => void;
};

const RequestDiagnosisForm = ({ setDiagnosis }: RequestDiagnosisFormProps) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Option[]>([]);
  const [fetchingSymptoms, setFetchingSymptoms] = useState(false);
  const [isRequestingForExternal, setIsRequestingForExternal] = useState(false);
  const [requestingDiagnosis, setRequestingDiagnosis] = useState(false);

  const [nonPersonalInfo, setNonPersonalInfo] = useState({
    gender: 'gender',
    birthyear: dayjs().year(),
  });

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

  const requestDiagnosis = async () => {
    if (requestingDiagnosis) return;

    console.log({
      selectedSymptoms,
      nonPersonalInfo,
    });

    let params: GetDiagnosisParams = {
      symptomsIds: selectedSymptoms.map((symptom) => symptom.value) as number[],
    };

    if (!selectedSymptoms.length) {
      toast.error('Please select at least one symptom');
      return;
    }

    if (isRequestingForExternal) {
      if (nonPersonalInfo.gender === 'gender') {
        toast.error('Please select a valid gender');
        return;
      }

      if (nonPersonalInfo.birthyear === dayjs().year()) {
        toast.error('Please select a valid birthdate');
        return;
      }

      params = {
        ...params,
        ...nonPersonalInfo,
      };
    }

    setRequestingDiagnosis(true);

    const response = await getDiagnosis(params);
    if (response) {
      setDiagnosis(response.data);
      toast.success('Diagnosis requested successfully');
    } else {
      setDiagnosis([]);
    }

    setRequestingDiagnosis(false);
  };

  useEffect(() => {
    void fetchSymptoms();
  }, []);

  const handleSymptomsChange = (newSymptoms: unknown) => {
    setSelectedSymptoms(newSymptoms as Option[]);
  };

  const handlePersonRequestingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRequestingForExternal(e.target.checked);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNonPersonalInfo((old) => ({
      ...old,
      gender: e.target.value,
    }));
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNonPersonalInfo((old) => ({
      ...old,
      birthyear: dayjs(e.target.value).year(),
    }));
  };

  return (
    <div className="flex flex-col gap-10 w-full h-full">
      <p className="text-xl">Please select your current symptoms:</p>
      <VirtualizedMultiSelect
        options={symptoms.map((symptom) => ({ label: symptom.Name, value: symptom.ID }))}
        loading={fetchingSymptoms}
        placeholder="Select Symptoms"
        isSearchable={true}
        value={selectedSymptoms}
        onChange={handleSymptomsChange}
      />
      <section className="flex flex-row justify-between w-full md:w-2/3 xl:w-1/2">
        <label className="hover:text-cyan-100 cursor-pointer w-full " htmlFor="personal">
          Requesting for Another Person
        </label>
        <input
          type="checkbox"
          id="personal"
          checked={isRequestingForExternal}
          onChange={handlePersonRequestingChange}
        />
      </section>
      {isRequestingForExternal && (
        <section className="flex flex-col gap-5 w-full md:w-2/3 xl:w-1/2">
          <select
            className="h-18 my-1 rounded-md p-5 hover:text-semibold"
            style={{
              backgroundColor: 'field',
            }}
            onChange={handleGenderChange}
            value={nonPersonalInfo.gender}
          >
            <option value={'gender'} disabled>
              Gender
            </option>
            {(
              Object.values(Genders)
                .filter((g) => typeof g === 'string')
                .map((g) => ({
                  label: g,
                  value: g,
                })) as Option[]
            )?.map((option: Option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex flex-row justify-between items-center">
            <label htmlFor="birthdate">Date of birth:</label>
            <input
              id="birthdate"
              className="h-18 my-1 rounded-md p-5 hover:text-semibold"
              placeholder={'Date of Birth'}
              type="date"
              max={dayjs().toISOString().split('T')[0]}
              onChange={handleBirthdateChange}
            />
          </div>
        </section>
      )}

      <PrimaryButton loading={requestingDiagnosis} onClick={requestDiagnosis}>
        Request{requestingDiagnosis && 'ing'} Diagnosis{requestingDiagnosis && '...'}
      </PrimaryButton>
    </div>
  );
};

export default RequestDiagnosisForm;
