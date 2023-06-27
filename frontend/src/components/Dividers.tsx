import React from 'react';
import { classNames } from '../utils';

type DividerProps = {
  id?: string;
  style?: React.CSSProperties;
  noMargin?: boolean;
};

const HorizontalDivider = ({ id, style, noMargin }: DividerProps) => (
  <hr
    id={id}
    style={style}
    className={classNames(
      noMargin ? '' : 'my-12',
      `h-px border-t-0 bg-transparent 
  bg-gradient-to-r from-transparent via-neutral-500 
  to-transparent opacity-25 dark:opacity-100`
    )}
  />
);

export { HorizontalDivider };
