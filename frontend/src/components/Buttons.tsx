import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { type ReactNode } from 'react';
import { Spinner } from '.';
import { classNames } from '../utils';

type ButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const PrimaryButton = ({ children, onClick, loading, type }: ButtonProps) => (
  <button
    className={classNames(`bg-cyan-500 hover:bg-cyan-400  font-semibold 
    justify-center items-center flex flex-row h-18 my-2 rounded-xl p-5`)}
    onClick={onClick}
    type={type ?? 'button'}
  >
    {loading && (
      <Spinner
        color="white"
        size="small"
        style={{
          marginTop: '-1rem',
          marginRight: '1.0rem',
        }}
      />
    )}
    {children}
  </button>
);

const SecondaryButton = ({ children, onClick }: ButtonProps) => (
  <button
    type="button"
    className={`text-cyan-300 hover:text-cyan-200 font-semibold 
    h-10 my-2 rounded-md mx-auto w-1/2`}
    onClick={onClick}
  >
    {children}
  </button>
);

const InfoButton = ({ onClick }: ButtonProps) => (
  <button onClick={onClick}>
    <FontAwesomeIcon icon={faInfoCircle} size="xl" />
  </button>
);

export { InfoButton, PrimaryButton, SecondaryButton };
