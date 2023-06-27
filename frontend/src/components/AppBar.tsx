import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../assets/images';
import { AppBarButton } from './Buttons';

const AppBar = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  console.log({ location });

  const routes = [
    {
      path: '/request-diagnosis',
      name: 'Request Diagnosis',
    },
    {
      path: '/history',
      name: 'History',
    },
  ];

  return (
    <nav
      className="app-bar flex flex-row justify-between items-center 
    bg-backgroundDark mb-10 h-20 px-10
    border border-white border-opacity-10 rounded-lg"
    >
      <Logo />
      <div className="flex flex-row gap-10 w-1/2 lg:w-1/3">
        {routes.map((route) => (
          <AppBarButton
            key={route.path}
            onClick={() => {
              navigate(route.path);
            }}
            disabled={location === route.path}
            location={location}
            path={route.path}
          >
            {route.name}
          </AppBarButton>
        ))}
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
