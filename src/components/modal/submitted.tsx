// @flow
import { faArrowUpFromLine } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'components/modal/index';
import React, { PropsWithChildren } from 'react';

export interface ModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open: boolean;

  closeModal(): void;
}

export type ModalProps = PropsWithChildren<ModalPropsInterface>;

const SubmittedModal = (props: ModalProps) => {
  const { open, closeModal } = props;
  return (
    <div>
      <Modal open={open} closeModal={closeModal}>
        <main className={'flex flex-col gap-8 justify-center items-center'}>
          <FontAwesomeIcon style={{ fontSize: 96 }} icon={faArrowUpFromLine}></FontAwesomeIcon>
          <div className={'text-center'}>
            <h3 className={'font-normal'}>Transition Submitted</h3>
            <a className={' text-primary text-lg font-normal cursor-pointer'}>View on Explorer</a>
          </div>
          <div>
            <button onClick={closeModal} className={'btn-medium btn-primary-inverted px-12 outline-0'}>
              Close
            </button>
          </div>
        </main>
      </Modal>
    </div>
  );
};
export default SubmittedModal;
