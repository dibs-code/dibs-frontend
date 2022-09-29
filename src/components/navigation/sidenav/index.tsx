import React, { Fragment, PropsWithChildren } from 'react';
// import { faXmark } from '@fortawesome/pro-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Dialog, Transition } from '@headlessui/react';

export interface ModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;

  // closeModal(): void;
}

export type ModalProps = PropsWithChildren<ModalPropsInterface>;

const Sidenav = (props: ModalProps) => {
  // const { open, closeModal, children, className, title } = props;

  return (
    <>
      <nav className={'w-68 px-9 py-10 bg-white rounded-2xl fixed'}>
        <h5 className={'font-semibold text-primary text-center'}>0x5a…c7eF</h5>
      </nav>
    </>
  );
};

export default Sidenav;
