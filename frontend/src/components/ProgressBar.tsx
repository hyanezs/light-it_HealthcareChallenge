import React from 'react';
import colors from '../config/colors';
import { classNames } from '../utils';

type ProgressBarProps = {
  progress: number;
};

const getColor = (progress: number, weight: keyof typeof colors.amber) => {
  if (progress < 25) return colors.red[weight];
  if (progress < 50) return colors.yellow[weight];
  if (progress < 75) return colors.blue[weight];
  return colors.green[weight];
};

const ProgressBar = ({ progress }: ProgressBarProps) => (
  <div className="w-full relative">
    <div
      className={'rounded-full border p-1'}
      style={{
        borderColor: getColor(progress, '400'),
      }}
    >
      <div
        className={classNames(
          `flex h-6 items-center justify-center rounded-full 
        text-xs leading-none`
        )}
        style={{
          width: `${progress}%`,
          backgroundColor: getColor(progress, '200'),
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
