import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useEffect, useRef, useState, type MouseEventHandler } from 'react';
import { classNames } from '../../utils';

type Option = {
  label: string;
  subLabel?: string;
  value: string | number;
};

type SearchableSelectProps = {
  title: string;
  placeholder?: string;
  options: Option[];
  selectedValue: string | number | undefined;
  setSelectedValue: (value: number | string) => void;
  disabled?: boolean;
};

const SearchableSelect = ({
  title,
  placeholder,
  options,
  selectedValue,
  setSelectedValue,
  disabled,
}: SearchableSelectProps) => {
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchValue
    ? options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
    : options;

  const handleButtonClick = () => {
    setOpen(!open);
    setInputFocused(true);
  };

  const handleOptionSelect = (value: string | number) => {
    setSelectedValue(value);
    setOpen(false);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    setOpen(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
    if (!open) {
      setOpen(false);
    }
  };

  const handleInputClick: MouseEventHandler<HTMLInputElement> = (e) => {
    if (open) {
      e.stopPropagation();
    }
  };

  const handleOutsideClick: EventListener = (e) => {
    if (componentRef?.current && !componentRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setSearchValue(undefined);
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const getDisplayValue = () => {
    const option = options.find((option) => option.value === selectedValue);
    return open
      ? searchValue
      : `${option?.label ?? ''}${option?.subLabel ? ` (${option?.subLabel})` : ''}`;
  };

  return (
    <Listbox value={selectedValue} onChange={setSelectedValue}>
      {() => (
        <>
          <Listbox.Label className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </Listbox.Label>
          <div className="relative mt-2" ref={componentRef}>
            <Listbox.Button
              aria-disabled={disabled}
              onClick={handleButtonClick}
              className="relative w-80 cursor-default rounded-lg bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <input
                type="text"
                placeholder={placeholder ?? 'Select an Option'}
                value={getDisplayValue() ?? ''}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onClick={handleInputClick}
                ref={inputRef}
                className="outline-none w-full bg-transparent placeholder-gray-500 sm:text-sm sm:leading-6"
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </Listbox.Button>

            {(open || inputFocused) && (
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredOptions.length === 0 && (
                    <Listbox.Option
                      className="relative cursor-default select-none py-2 pl-3 pr-9"
                      value={undefined}
                    >
                      <span className="text-gray-500">No options found</span>
                    </Listbox.Option>
                  )}
                  {filteredOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-pointer select-none py-2 pl-3 pr-9'
                        )
                      }
                      onClick={() => {
                        handleOptionSelect(option.value);
                      }}
                      value={option.value}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex">
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'inline-flex whitespace-nowrap'
                              )}
                            >
                              {option.label}
                            </span>
                            <span
                              className={classNames(
                                active ? 'text-indigo-200' : 'text-gray-500',
                                'ml-2 truncate text-xs'
                              )}
                              style={{
                                lineHeight: '1.25rem',
                              }}
                            >
                              {option.subLabel}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            )}
          </div>
        </>
      )}
    </Listbox>
  );
};

export default SearchableSelect;
