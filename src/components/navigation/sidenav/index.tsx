import { faCircleC, faFileChartColumn, faGift } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWeb3React } from '@web3-react/core';
import { useDibs } from 'hooks/dibs/useDibs';
import useWalletActivation from 'hooks/useWalletActivation';
import React, { PropsWithChildren, useMemo } from 'react';
import { shortenAddress } from 'utils/index';

// import { Dialog, Transition } from '@headlessui/react';

export interface ModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;

  // closeModal(): void;
}

export type ModalProps = PropsWithChildren<ModalPropsInterface>;

const Sidenav = () => {
  const { account } = useWeb3React();
  const { addressToName } = useDibs();
  const hasCode = useMemo(() => !!addressToName, [addressToName]);
  const links = [
    { name: 'Your code', icon: faCircleC, active: true, address: '' },
    { name: 'Rewards', icon: faGift, active: false, address: '/rewards' },
    { name: 'Reports', icon: faFileChartColumn, active: false, address: '/reports' },
  ];

  const { tryActivation, disconnectWallet } = useWalletActivation();
  const renderConnector = () => {
    return account ? (
      <>
        <h4 className={'font-semibold mb-2 text-primary text-center'}>{shortenAddress(account)}</h4>
        <p className={'text-center'}>
          <span
            className={`h-9 rounded-md inline-flex items-center px-4 bg-input ${
              hasCode ? 'text-base font-medium' : 'text-sm font-regular'
            }`}
          >
            {addressToName || 'No code exist'}
          </span>
        </p>
      </>
    ) : (
      <div className={'flex justify-center'}>
        <button className={'btn-primary-inverted btn-medium text-center'} onClick={tryActivation}>
          Connect Wallet
        </button>
      </div>
    );
  };

  return (
    <>
      <nav className={'w-68 px-9 py-10 bg-white rounded-2xl fixed shadow-[0_6px_24px_rgba(0,0,0,0.05)]'}>
        {renderConnector()}
        <ul className={'pl-2 mt-16 mb-24'}>
          {links.map((link) => {
            return (
              <li
                className={`flex mb-3 items-center cursor-pointer transition duration-200 hover:text-primary ${
                  link.active ? 'text-primary' : 'text-light-gray-3'
                }
               ${link.name === 'Reports' ? 'pl-0.5 gap-4' : 'pl-0 gap-3'}`}
                key={link.name}
              >
                <FontAwesomeIcon style={{ fontSize: 20 }} icon={link.icon}></FontAwesomeIcon>
                <span className={`${link.active ? '' : 'font-normal'}`}>{link.name}</span>
              </li>
            );
          })}
        </ul>
        {account && (
          <div className={'flex justify-center'}>
            <button className={'btn-primary-inverted btn-medium text-center'} onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Sidenav;
