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
  style?: React.CSSProperties;
  disabled?: boolean;
};

const PrimaryButton = ({ children, disabled, onClick, loading, type, style }: ButtonProps) => (
  <button
    className={classNames(
      disabled ? 'cursor-default opacity-30' : 'bg-cyan-500 hover:bg-cyan-400',
      `font-semibold 
    justify-center items-center flex flex-row h-18 my-2 rounded-xl p-5`
    )}
    onClick={onClick}
    type={type ?? 'button'}
    style={style}
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

const SecondaryButton = ({ children, onClick, style, disabled }: ButtonProps) => (
  <button
    type="button"
    className={classNames(
      disabled ? 'text-gray-500 cursor-default' : 'text-cyan-300 hover:text-cyan-200',
      `font-semibold 
    h-10 my-2 rounded-md`
    )}
    onClick={disabled ? () => undefined : onClick}
    style={style}
  >
    {children}
  </button>
);

type AppBarButtonProps = ButtonProps & {
  location?: string;
  path?: string;
};

const AppBarButton = ({
  children,
  onClick,
  style,
  disabled,
  path,
  location,
}: AppBarButtonProps) => (
  <button
    type="button"
    className={classNames(
      disabled ? 'cursor-default' : '',
      location === path ? 'text-opacity-100' : 'text-opacity-50 hover:text-cyan-100',
      `font-semibold text-cyan-300  
    h-10 my-2 rounded-md mx-auto w-1/2`
    )}
    onClick={disabled ? () => undefined : onClick}
    style={style}
  >
    {children}
  </button>
);

const InfoButton = ({ onClick }: ButtonProps) => (
  <button onClick={onClick}>
    <FontAwesomeIcon icon={faInfoCircle} size="xl" />
  </button>
);

export { AppBarButton, InfoButton, PrimaryButton, SecondaryButton };
