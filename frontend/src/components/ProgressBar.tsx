import React from 'react';
import colors from '../config/colors';
import { classNames } from '../utils';

type ProgressBarProps = {
  progress: number;
  size?: 'small' | 'large';
};

const getColor = (progress: number, weight: keyof typeof colors.amber) => {
  if (progress < 25) return colors.red[weight];
  if (progress < 50) return colors.yellow[weight];
  if (progress < 75) return colors.blue[weight];
  return colors.green[weight];
};

const ProgressBar = ({ progress, size = 'large' }: ProgressBarProps) => (
  <div className="w-full relative">
    <div
      className={classNames(size === 'large' ? 'p-1' : '', 'rounded-full border')}
      style={{
        borderColor: getColor(progress, '400'),
      }}
    >
      <div
        className={classNames(size === 'large' ? 'h-6' : 'h-4', `rounded-full leading-none`)}
        style={{
          width: `${progress}%`,
          backgroundColor: getColor(progress, '200'),
        }}
      />
      <span
        className={classNames(
          size === 'large' ? 'text-lg font-extrabold' : 'text-sm font-bold',
          `absolute top-1/2 left-1/2 transform 
          -translate-x-1/2 -translate-y-1/2 p-1 text-black`
        )}
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
