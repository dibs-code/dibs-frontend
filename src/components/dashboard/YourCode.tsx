import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Input from "components/basic/input";
import React, { Fragment, PropsWithChildren } from 'react';
// import { Dialog, Transition } from '@headlessui/react';

export interface ModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;

  // closeModal(): void;
}




export type ModalProps = PropsWithChildren<ModalPropsInterface>;

const YourCode = (props: ModalProps) => {

  // const [hasCode, setOpenhasCode] = useState(false);
  //
  // function openhasCode() {
  //   setOpenhasCode(true);
  // }
  //
  // const [links, setLinks] = useState([]);

  // const { open, closeModal, children, className, title } = props;

  return (
    <>
      <header className={'border-b pb-4 mb-16'}>
        <h2>Your Code</h2>
      </header>
      <main>
        <div className={'rounded-2xl text-xl bg-nocode bg-cover'}>
          <p className={'text-2xl font-normal h-64 px-24 text-center flex justify-center items-center'}>You didn’t create your dibs code yet,<br></br>
            Create one and start earning!</p>
        </div>
        <div className={'inline-flex gap-2 mt-4 items-center px-4 py-4 bg-blue-gray-light rounded-lg'}><FontAwesomeIcon style={{ fontSize: 20, color: '#2394D3' }} icon={faCircleInfo}></FontAwesomeIcon>
        <p className={'font-normal'}>Your dibs code can contain use lowercase, uppercase Letters and numbers</p>
        </div>
        <section className={'mt-8 flex gap-4 items-center'}>
          <Input className={'flex-auto'} value={'xxxxx'} label={'Your Code'} placeholder={'Enter Amount'} />
          <Input className={'flex-auto'} value={'xxxxx'} label={'Your Referral Code'} placeholder={'Enter Amount'} />
          <button  className={'btn-primary btn-large font-medium mt-4 px-12'} >
            Create
          </button>
        </section>
      </main>
    </>
  );
};

export default YourCode;
