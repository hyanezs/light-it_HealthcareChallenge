import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components';
import logout from '../public/authentication/api/logout';

const LogoutScreen = () => {
  const navigate = useNavigate();

  const onLogout = useCallback(async () => {
    const response = await logout();
    if (response) {
      navigate('/login');
    } else {
      navigate(-1);
    }
  }, [navigate]);

  useEffect(() => {
    void onLogout();
  }, [onLogout]);

  return (
    <div className="centered">
      <Spinner />
    </div>
  );
};

export default LogoutScreen;
