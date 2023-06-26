import React from 'react';
import { classNames } from '../utils';

type ProgressBarProps = {
  progress: number;
};

const getBorderColor = (progress: number) => {
  if (progress < 25) return 'border-red-500';
  if (progress < 50) return 'border-yellow-500';
  if (progress < 75) return 'border-blue-500';
  return 'border-green-500';
};

const getColor = (progress: number) => {
  if (progress < 25) return 'bg-red-200';
  if (progress < 50) return 'bg-yellow-200';
  if (progress < 75) return 'bg-blue-200';
  return 'bg-green-200';
};

const ProgressBar = ({ progress }: ProgressBarProps) => (
  <div className="w-full relative">
    <div className={classNames(getBorderColor(progress), `rounded-full border border-red-500 p-1`)}>
      <div
        className={classNames(
          getColor(progress),
          `flex h-6 items-center justify-center rounded-full 
        text-xs leading-none`
        )}
        style={{
          width: `${progress}%`,
        }}
      />
      <span
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        p-1 text-black font-extrabold text-lg"
        style={{
          color: progress < 46 ? 'white' : 'black',
        }}
      >
        {progress}%
      </span>
    </div>
  </div>
);

export default ProgressBar;
