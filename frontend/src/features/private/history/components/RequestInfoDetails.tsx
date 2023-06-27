import dayjs from 'dayjs';
import React from 'react';
import { type DiagnosisRequest, type Symptom } from '../../../../types';
import { Genders } from '../../../../types/constants';
import { classNames } from '../../../../utils';

type RequestInfoDetailsProps = {
  request: DiagnosisRequest;
  symptoms: Symptom[];
};

const RequestInfoDetails = ({ request, symptoms }: RequestInfoDetailsProps) => (
  <section>
    <div className="flex flex-row justify-between gap-10 items-center">
      <span className="text-lg">Requested on:</span>
      <span className="text-md">{dayjs(request.requestedOn).format('MMMM D, YYYY h:mm A')}</span>
    </div>
    <div className="flex flex-row justify-between gap-10 items-center">
      <span className="text-lg">Gender:</span>
      <span className="text-md">{Genders[request.gender]}</span>
    </div>
    <div className="flex flex-row justify-between gap-10 items-center">
      <span className="text-lg">Age:</span>
      <span className="text-md">{dayjs().year() - request.birthyear}</span>
    </div>
    <div className="flex flex-row justify-between gap-10 items-center">
      <span className="text-lg">Symptoms:</span>
      <span className="text-md">
        {request?.symptomsIds
          ?.split(',')
          ?.map((id) => symptoms.find((s) => s.ID === parseInt(id, 10))?.Name)}
      </span>
    </div>
    <div
      className={classNames(
        request?.possibleDiagnoses?.some((d) => d.confirmed) ? 'text-green-200' : 'text-red-200',
        `flex flex-row justify-between gap-10 items-center`
      )}
    >
      <span className="text-lg">Confirmed:</span>
      <span className="text-md">
        {request?.possibleDiagnoses?.some((d) => d.confirmed) ? 'Yes' : 'No'}
      </span>
    </div>
  </section>
);

export default RequestInfoDetails;
