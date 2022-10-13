import { faCircleCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

export default function ClipboardPopup({ show }: { show: boolean }) {
  return (
    <Transition
      as={Fragment}
      show={show}
      enter="transform ease-in-out transition duration-[400ms]"
      enterFrom="opacity-0 w-0 translate-x-32"
      enterTo="opacity-100 w-full translate-x-0"
      leave="transform duration-500 transition ease-in-out"
      leaveFrom="opacity-100 "
      leaveTo="opacity-0 scale-95 -translate-y-32 "
    >
      <div
        className="w-80 pr-3 pl-4 py-4 fixed right-8 gap-4 top-8 z-100 rounded-xl bg-white shadow-md flex items-center
          "
      >
        <FontAwesomeIcon style={{ fontSize: 24 }} className={'text-green-600'} icon={faCircleCheck}></FontAwesomeIcon>
        <div className={'flex flex-col gap-2'}>Copied Successfully!</div>
      </div>
    </Transition>
  );
}
