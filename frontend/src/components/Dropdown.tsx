import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, type ReactNode } from 'react';

type Item = {
  label: string | ReactNode;
  onClick: () => void;
  key: string;
};

type DropdownProps = {
  buttonChild: ReactNode;
  sections: Array<{
    key: string;
    items: Item[];
  }>;
};

const Dropdown = ({ buttonChild, sections }: DropdownProps) => (
  <Menu as="div" className="relative inline-block text-left">
    <div>
      <Menu.Button>{buttonChild}</Menu.Button>
    </div>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className="absolute left-0 z-10 mt-2 w-40 origin-top-right rounded-md
       bg-backgroundDark shadow-lg ring-1 ring-white ring-opacity-5 
       focus:outline-none px-3 py-1"
      >
        <div className="py-1">
          {sections.map((section) => (
            <div className="py-1" key={section.key}>
              {section.items.map((item) => (
                <Menu.Item key={item.key}>
                  {({ active }) => (
                    <button
                      onClick={item.onClick}
                      className="block text-xs py-2 px-2 text-fontGray hover:text-white
                        hover:bg-background rounded-lg w-full text-left"
                    >
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          ))}
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
);

export default Dropdown;
