import React, { type CSSProperties } from 'react';
import { classNames } from '../utils';

type SpinnerProps = {
  className?: string;
  style?: CSSProperties;
  color?: string;
  size?: 'small' | 'medium' | 'large';
};

const getSize = (size: 'small' | 'medium' | 'large' | undefined) => {
  switch (size) {
    case 'small':
      return 'w-4 h-4 border-2';
    case 'medium':
      return 'w-8 h-8 border-4';
    case 'large':
      return 'w-12 h-12 border-6';
    default:
      return 'w-8 h-8 border-4';
  }
};

const getColor = (color?: string) => {
  switch (color) {
    case 'white':
      return 'border-white';
    default:
      return 'border-activeBlue';
  }
};

const Spinner = ({ style, className, size, color }: SpinnerProps) => (
  <div
    className={classNames(`transform translate-x-1/2 translate-y-1/2`, className ?? '')}
    style={style}
  >
    <div
      className={classNames(
        'border-t-transparent border-solid animate-spin rounded-full',
        getSize(size),
        getColor(color)
      )}
    />
  </div>
);

export default Spinner;
