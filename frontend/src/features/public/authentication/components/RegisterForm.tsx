import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logo } from '../../../../assets/images';
import { PrimaryButton, SecondaryButton } from '../../../../components';
import type { Input, Option } from '../../../../types';
import { Genders } from '../../../../types/constants';
import { camelToTitle } from '../../../../utils';
import register, { type RegisterRequest } from '../api/register';

type passwordType = 'password' | 'text';

const RegisterForm = () => {
  const [registering, setRegistering] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined);
  const [togglePasswordVisibility, setTogglePasswordVisibility] = useState<
    Record<string, passwordType>
  >({
    password: 'password',
    confirmPassword: 'password',
  });

  const navigate = useNavigate();

  const inputs: Input[] = [
    {
      type: 'text',
      name: 'firstName',
    },
    {
      type: 'text',
      name: 'lastName',
    },
    {
      type: 'date',
      name: 'birthdate',
      // Min usable age of 13 years cause of GDPR
      max: dayjs().subtract(13, 'year').toISOString().split('T')[0],
    },
    {
      type: 'select',
      name: 'gender',
      options: Object.values(Genders)
        .filter((g) => typeof g === 'string')
        .map((g) => ({
          label: g,
          value: g,
        })) as Option[],
    },
    {
      type: 'email',
      name: 'email',
      autocomplete: 'email',
    },
  ];

  const passwordInputs: Input[] = [
    {
      type: 'password',
      name: 'password',
      autocomplete: 'new-password',
    },
    {
      type: 'password',
      name: 'confirmPassword',
      autocomplete: 'new-password',
    },
  ];

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (registering) return;
    setRegistering(true);
    const formData: Record<string, unknown> = {};

    inputs.concat(passwordInputs).forEach((input) => {
      formData[input.name] = (event.target as HTMLFormElement)[input.name].value;
    });

    formData.gender = selectedGender;
    console.log(formData);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match, please check them and try again.');
      setRegistering(false);
      return;
    }

    console.log(formData.gender);

    if (!Object.values(Genders).includes(formData.gender as Genders)) {
      toast.error('Please select a valid Gender');
      setRegistering(false);
      return;
    }

    delete formData.confirmPassword;

    const response = await register(formData as RegisterRequest);
    setRegistering(false);
    if (response) {
      toast.success(response.success);
      navigate('/request-diagnosis');
    }
  };

  return (
    <div className="register-form">
      <div className="flex flex-row justify-between">
        <p className="block font-bold text-5xl leading-tight font-power-grotesk">Welcome</p>
        <Logo />
      </div>
      <div className="mt-8 flex flex-col">
        <form className="flex flex-col" onSubmit={handleRegister}>
          {inputs.map((input) =>
            input.type === 'select' ? (
              <select
                key={input.name}
                className="h-18 my-1 rounded-md p-5 hover:text-semibold"
                style={{
                  backgroundColor: 'field',
                }}
                name={input.name}
                onChange={(e) => {
                  setSelectedGender(e.target.value);
                }}
                value={selectedGender}
              >
                <option value={undefined}>Gender</option>
                {input.options?.map((option: Option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={input.name}
                id={input.name}
                required={input.optional !== true}
                className="h-18 my-1 rounded-md p-5 hover:text-semibold"
                placeholder={input.placeholder ?? camelToTitle(input.name)}
                type={input.type}
                name={input.name}
                max={input.max}
                autoComplete={input.autocomplete}
              />
            )
          )}
          {passwordInputs.map((input) => (
            <div key={input.name} className="flex flex-row">
              <input
                required={input.optional !== true}
                className="h-18 my-1 rounded-l-md p-5 w-full focus:border-cyan-400"
                placeholder={input.placeholder ?? camelToTitle(input.name)}
                type={togglePasswordVisibility[input.name]}
                name={input.name}
                autoComplete={input.autocomplete}
              />
              <button
                className="h-18 my-1 rounded-r-md p-5"
                style={{
                  background: 'field',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setTogglePasswordVisibility((prevState) => ({
                    ...prevState,
                    [input.name]: prevState[input.name] === 'password' ? 'text' : 'password',
                  }));
                }}
              >
                <FontAwesomeIcon
                  icon={togglePasswordVisibility[input.name] === 'password' ? faEyeSlash : faEye}
                />
              </button>
            </div>
          ))}
          <PrimaryButton loading={registering} type="submit">
            Create Account
          </PrimaryButton>
        </form>
        <SecondaryButton
          onClick={() => {
            navigate('/login');
          }}
        >
          Back to Login
        </SecondaryButton>
      </div>
    </div>
  );
};

export default RegisterForm;
