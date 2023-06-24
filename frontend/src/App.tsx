import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './app.css';

import ProtectedRoute from './components/ProtectedRoute';
import GlobalNavigation from './hooks/GlobalNavigation';
import routes from './routes';

const App: React.FC = () => (
  <div className="h-screen p-5">
    <ToastContainer position="bottom-right" />
    <BrowserRouter>
      <GlobalNavigation />
      <Routes>
        {routes.map((route) => (
          <Route
            path={route.path}
            element={
              route.private ? <ProtectedRoute>{route.element}</ProtectedRoute> : route.element
            }
            key={route.path}
          />
        ))}
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
