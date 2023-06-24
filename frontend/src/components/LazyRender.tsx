import React, { Suspense, type ReactNode } from 'react';
import Spinner from './Spinner';

const LazyRender = (element: ReactNode, isScreen = true) => (
  <Suspense
    fallback={
      <div
        className={isScreen ? 'screen-container' : ''}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 100,
        }}
      >
        <Spinner />
      </div>
    }
  >
    {element}
  </Suspense>
);

export default LazyRender;
