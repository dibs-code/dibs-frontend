import { faCopy } from '@fortawesome/pro-regular-svg-icons';
import { faCircleInfo} from '@fortawesome/pro-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Input from "components/basic/input";
import React, { Fragment, PropsWithChildren, useState } from 'react';
// import { Dialog, Transition } from '@headlessui/react';

export interface ModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;

  // closeModal(): void;
}




export type ModalProps = PropsWithChildren<ModalPropsInterface>;

const YourCode = (props: ModalProps) => {

  const [hasCode, setHasCode] = useState(false);

  function Create() {
    setHasCode(true);
  }
  //
  // const [links, setLinks] = useState([]);

  // const { open, closeModal, children, className, title } = props;

  return (
    <>

      <header className={'border-b pb-4 mb-16'}>
        <h2>Your Code</h2>
      </header>
      { hasCode ? (
          <main>
            <p>Share the code below with others and start earning.
              With each trade of the ones using your code, you earn a portion of the trade fee.
              For more information, please visit [link]</p>
            <section className={'rounded-2xl bg-codeinfo h-80 bg-cover mt-4 flex flex-col gap-3 justify-center items-center'}>
              <div><div className={'rounded-xl bg-primary-light inline-block p-4'}><span className={'text-lg mr-3'}>Your Dibs Code:</span><span className={'text-2xl text-primary'}>Beigiz96</span></div></div>
              <div><div className={'rounded-xl bg-soft-pink inline-block p-4'}><span className={'mr-2'}>Trade link: </span><span className={'font-normal mr-2'}>https://dextradelink.com/?Beigiz96</span>
                <span className={'py-1 px-2 bg-white rounded shadow-[0_4px_6px_rgba(0,0,0,0.07)] cursor-pointer transition duration-200 hover:shadow-xl'}>
                <FontAwesomeIcon style={{ fontSize: 18 }} icon={faCopy}></FontAwesomeIcon></span></div></div>
              <div><div className={'rounded-xl bg-soft-blue inline-block p-4'}><span className={'mr-2'}>Register link:</span><span className={'font-normal mr-2'}> https://dibsregisterlink.com/?Beigiz96</span>
                <span className={'py-1 px-2 bg-white rounded shadow-[0_4px_6px_rgba(0,0,0,0.07)] cursor-pointer transition duration-200 hover:shadow-xl'}>
                <FontAwesomeIcon style={{ fontSize: 18 }} icon={faCopy}></FontAwesomeIcon></span></div></div>
            </section>
          </main>
        ) : (
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
            <button  className={'btn-primary btn-large font-medium mt-4 px-12'} onClick={Create} >
              Create
            </button>
          </section>
        </main>
      ) }

    </>
  );
};

export default YourCode;
