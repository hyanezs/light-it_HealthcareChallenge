import { type HTMLInputTypeAttribute } from 'react';

type Option = {
  value: string | number;
  label: string;
};

type Input = {
  name: string;
  label?: string;
  type: HTMLInputTypeAttribute;
  optional?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  autocomplete?: string;
  min?: number | string;
  max?: number | string;
  options?: Option[];
};

export type { Input, Option };
