import React from 'react';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import './authenticate-screen.css';

type AuthenticateScreenProps = {
  isLogin?: boolean;
};

const AuthenticateScreen = ({ isLogin }: AuthenticateScreenProps) => (
  <div className="flex md:flex-row justify-center items-center h-full md:gap-40 mx-20">
    <div className="max-w-md" style={{ minWidth: '30rem' }}>
      {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  </div>
);

export default AuthenticateScreen;
