import { faCircleC, faFileChartColumn,faGift } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, PropsWithChildren, useState } from 'react';
// import { Dialog, Transition } from '@headlessui/react';

export interface ModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;

  // closeModal(): void;
}




export type ModalProps = PropsWithChildren<ModalPropsInterface>;

const Sidenav = (props: ModalProps) => {

  const [hasCode, setOpenhasCode] = useState(true);

  function openhasCode() {
    setOpenhasCode(true);
  }

  const [links, setLinks] = useState([
    {name: 'Your code', icon: faCircleC, active: true, address: ''},
    {name: 'Rewards', icon: faGift, active: false, address: ''},
    {name: 'Reports', icon: faFileChartColumn, active: false, address: ''},
  ]);

  // const { open, closeModal, children, className, title } = props;

  return (
    <>
      <nav className={'w-68 px-9 py-10 bg-white rounded-2xl fixed shadow-[0_6px_24px_rgba(0,0,0,0.05)]'}>
        <h4 className={'font-semibold mb-2 text-primary text-center'}>0x5a…c7eF</h4>
        <p className={'text-center'}><span className={`h-9 rounded-md inline-flex items-center px-4 bg-input ${(hasCode) ? 'text-base font-medium' : 'text-sm font-regular'}`}>{(hasCode) ? 'Beigiz96' : 'No code exist'}</span></p>
        <ul className={'pl-2 mt-16 mb-24'}>
          { links.map(link => {
            return(
              <li className={`flex mb-3 items-center cursor-pointer transition duration-200 hover:text-primary ${(link.active) ? 'text-primary' : 'text-light-gray-3'}
               ${(link.name == 'Reports') ? 'pl-0.5 gap-4' : 'pl-0 gap-3'}`} key={link.name}><FontAwesomeIcon style={{ fontSize: 20 }}
                icon={link.icon}></FontAwesomeIcon><span className={`${(link.active) ? '' : 'font-normal'}`}>{link.name}</span></li>
            )
          }) }
        </ul>
        <div className={'flex justify-center'}><button className={'btn-primary-inverted btn-medium text-center'}>
          Disconnect Wallet
        </button></div>
      </nav>
    </>
  );
};

export default Sidenav;
