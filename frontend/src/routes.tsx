import React from 'react';
import { Navigate } from 'react-router-dom';
import { lazyRender } from './components';
import { type Route } from './types';

// Private
const DiagnosesScreen = React.lazy(
  async () => import('./features/private/diagnoses/DiagnosesScreen')
);
const HistoryScreen = React.lazy(async () => import('./features/private/history/HistoryScreen'));
const DiagnosisRequestDetailsScreen = React.lazy(
  async () => import('./features/private/history/DiagnosisRequestDetailsScreen')
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
    path: '/request-diagnosis',
    element: lazyRender(<DiagnosesScreen />),
    private: true,
  },
  {
    path: '/history',
    element: lazyRender(<HistoryScreen />),
    private: true,
  },
  {
    path: '/diagnoses/:id',
    element: lazyRender(<DiagnosisRequestDetailsScreen />),
    private: true,
  },
  {
    path: '/',
    element: <Navigate replace to="/login" />,
  },
];

export default routes;
