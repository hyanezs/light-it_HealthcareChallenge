import React from 'react';
import { useLocation } from 'react-router-dom';

const NotFoundScreen = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="font-bold text-5xl">A-Space</p>
      <br />
      <p className="text-xl">
        Oops! Looks like {location.pathname.slice(0, 50)} isn&apos;t a registered route
      </p>
    </div>
  );
};

export default NotFoundScreen;
