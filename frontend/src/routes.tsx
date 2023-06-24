import React from 'react';
import { Navigate } from 'react-router-dom';
import { lazyRender } from './components';
import { type Route } from './types';

// Private
const DiagnosisScreen = React.lazy(
  async () => import('./features/private/diagnosis/DiagnosisScreen')
);

// Public
const AuthenticateScreen = React.lazy(
  async () => import('./features/public/authentication/AuthenticateScreen')
);
const NotFoundScreen = React.lazy(async () => import('./features/public/NotFoundScreen'));
const LogoutScreen = React.lazy(async () => import('./features/private/LogoutScreen'));

const routes: Route[] = [
  { path: '*', element: lazyRender(<NotFoundScreen />) },
  {
    path: '/login',
    element: lazyRender(<AuthenticateScreen isLogin={true} />),
  },
  {
    path: '/register',
    element: lazyRender(<AuthenticateScreen />),
  },
  {
    path: '/logout',
    element: lazyRender(<LogoutScreen />),
  },
  {
    path: '/diagnosis',
    element: lazyRender(<DiagnosisScreen />),
    private: true,
  },
  {
    path: '/',
    element: <Navigate replace to="/login" />,
  },
];

export default routes;