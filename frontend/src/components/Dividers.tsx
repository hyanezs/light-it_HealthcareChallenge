import React from 'react';

type DividerProps = {
  id?: string;
};

const HorizontalDivider = ({ id }: DividerProps) => (
  <hr
    id={id}
    className="my-12 h-px border-t-0 bg-transparent 
  bg-gradient-to-r from-transparent via-neutral-500 
  to-transparent opacity-25 dark:opacity-100"
  />
);

export { HorizontalDivider };
