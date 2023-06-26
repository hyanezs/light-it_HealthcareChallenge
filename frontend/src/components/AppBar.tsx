import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../assets/images';
import { SecondaryButton } from './Buttons';

const AppBar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="app-bar flex flex-row justify-between items-center 
    bg-backgroundDark mb-10 h-20 px-10
    border border-white border-opacity-10 rounded-lg"
    >
      <Logo />
      <div className="flex flex-row gap-10">
        <SecondaryButton
          onClick={() => {
            navigate('/diagnoses');
          }}
        >
          Diagnoses
        </SecondaryButton>
        <SecondaryButton
          onClick={() => {
            navigate('/history');
          }}
        >
          History
        </SecondaryButton>
      </div>
      <div>
        <button
          onClick={() => {
            navigate('/logout');
          }}
          className="text-cyan-100 text-opacity-50 hover:text-opacity-100 py-2"
        >
          Logout
          <FontAwesomeIcon icon={faSignOut} className="ml-4" />
        </button>
      </div>
    </nav>
  );
};

export default AppBar;
