import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logo } from '../../../../assets/images';
import { PrimaryButton, SecondaryButton } from '../../../../components';
import { type Input } from '../../../../types';
import { camelToTitle } from '../../../../utils';
import login, { type LoginRequest } from '../api/login';

const LoginForm = () => {
  const [togglePasswordVisibility, setTogglePasswordVisibility] = React.useState('password');
  const [loggingIn, setLoggingIn] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loggingIn) return;

    setLoggingIn(true);
    const formData: Record<string, string> = {};
    inputs.concat(passwordInputs).forEach((input) => {
      formData[input.name] = (event.target as HTMLFormElement)[input.name].value as string;
    });

    const response = await login(formData as LoginRequest);
    if (response) {
      toast.success(response.success);
      navigate('/diagnoses');
    }

    setLoggingIn(false);
  };

  const inputs: Input[] = [
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
      autocomplete: 'current-password',
    },
  ];

  return (
    <div className="login-form">
      <div className="flex flex-row justify-center mb-10">
        <Logo />
      </div>
      <p className="block text-4xl leading-tight font-power-grotesk">
        Use the <b>power</b> of the <b>cloud</b> to check for <br />
        <b>health symptoms</b>
      </p>
      <div className="mt-24 flex flex-col">
        <form className="flex flex-col" onSubmit={handleLogin}>
          {inputs.map((input) => (
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
          ))}
          {passwordInputs.map((input) => (
            <div key={input.name} className="flex flex-row">
              <input
                required={input.optional !== true}
                className="h-18 my-1 rounded-l-md p-5 w-full focus:border-cyan-400"
                placeholder={input.placeholder ?? camelToTitle(input.name)}
                type={togglePasswordVisibility}
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
                  setTogglePasswordVisibility((prevState) =>
                    prevState === 'password' ? 'text' : 'password'
                  );
                }}
              >
                <FontAwesomeIcon
                  icon={togglePasswordVisibility === 'password' ? faEyeSlash : faEye}
                />
              </button>
            </div>
          ))}

          <PrimaryButton type="submit" loading={loggingIn}>
            Login
          </PrimaryButton>
        </form>
        <SecondaryButton
          onClick={() => {
            navigate('/register');
          }}
        >
          Create Account
        </SecondaryButton>
      </div>
    </div>
  );
};

export default LoginForm;
