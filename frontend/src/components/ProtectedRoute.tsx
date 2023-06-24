import React, { useCallback, useEffect, useState } from 'react';

import { Navigate } from 'react-router-dom';
import { Spinner } from '.';
import { me } from '../api';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(0);

  const checkAuth = useCallback(async () => {
    setIsChecking(true);
    const response = await me();
    if (response) {
      setIsAuthenticated(1);
    } else {
      setIsAuthenticated(-1);
    }

    setIsChecking(false);
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  if (isChecking) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 100,
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated === -1) return <Navigate to="/" replace />;
  if (isAuthenticated === 1) return children;
};

export default ProtectedRoute;
