import React from 'react';
import WindowedSelect, { type ActionMeta, type PropsValue } from 'react-windowed-select';
import colors from '../config/colors';
import { type Option } from '../types';

type VirtualizedMultiSelectProps = {
  options: Option[];
  loading: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  value: PropsValue<Option[]>;
  onChange: (newSelections: unknown, actionMeta: ActionMeta<unknown>) => void;
};

const VirtualizedMultiSelect = ({
  placeholder,
  options,
  loading,
  isSearchable,
  value,
  onChange,
}: VirtualizedMultiSelectProps) => (
  <WindowedSelect
    id="virtualized-multi-select"
    isClearable={true}
    filterOption={(item, search) =>
      search === '' || item.label.toLowerCase().includes(search.toLowerCase())
    }
    options={options}
    windowThreshold={100}
    isDisabled={options.length === 0 || loading}
    isLoading={loading}
    placeholder={loading ? 'Loading...' : placeholder ?? 'Select an Option'}
    isMulti={true}
    hideSelectedOptions={true}
    isSearchable={isSearchable}
    value={value}
    onChange={onChange}
    styles={{
      control: (baseStyles) => ({
        ...baseStyles,
        cursor: 'pointer',
        backgroundColor: colors.backgroundDark,
        borderColor: colors.backgroundDark,
      }),
      option: (baseStyles, state) => ({
        ...baseStyles,
        cursor: 'pointer',
        backgroundColor: state.isRtl
          ? colors.brightYellow
          : state.isFocused
          ? colors.background
          : colors.backgroundDark,
      }),
      menu: (baseStyles) => ({
        ...baseStyles,
        backgroundColor: colors.backgroundDark,
      }),
      multiValue: (baseStyles) => ({
        ...baseStyles,
        backgroundColor: colors.fontGrayDark,
      }),
      multiValueLabel: (baseStyles) => ({
        ...baseStyles,
        color: '#fff',
      }),
    }}
  />
);
export default VirtualizedMultiSelect;
