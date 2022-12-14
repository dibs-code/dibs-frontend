import {faCircleC, faGift, faRightLeft} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Transition} from "@headlessui/react";
import { useWeb3React } from '@web3-react/core';
import WalletModal from 'components/WalletModal';
import { isSupportedChain } from 'constants/chains';
import { useDibs } from 'hooks/dibs/useDibs';
import useWalletActivation from 'hooks/useWalletActivation';
import React, {Fragment, PropsWithChildren, useMemo} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { shortenAddress } from 'utils/index';

import RoutePath from '../../../routes';

// import { Dialog, Transition } from '@headlessui/react';

export interface ModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;

  // closeModal(): void;
}

export type ModalProps = PropsWithChildren<ModalPropsInterface>;

const Sidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = React.useState(false);

  function closeModal() {
    setOpen(false);
  }

  const [show, setShow] = React.useState(false);

  // function closeModal() {
  //   setOpen(false);
  // }

  const { account, chainId } = useWeb3React();
  const { addressToName } = useDibs();
  const hasCode = useMemo(() => !!addressToName, [addressToName]);
  const links = useMemo(
    () => [
      { name: 'Your code', icon: faCircleC, address: RoutePath.HOME },
      { name: 'Rewards', icon: faGift, address: RoutePath.REWARDS },
      // { name: 'Reports', icon: faFileChartColumn, address: RoutePath.REPORTS },
      { name: 'Test swap', icon: faRightLeft, address: RoutePath.TEST_SWAP },
    ],
    [],
  );
  const { disconnectWallet } = useWalletActivation();

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
      <>
        <WalletModal closeModal={closeModal} open={open} />
        <div className={'flex justify-center'}>
          <button className={'btn-primary-inverted btn-medium text-center'} onClick={() => setOpen(true)}>
            Connect Wallet
          </button>
        </div>
      </>
    );
  };

  const menu = useMemo(
    () => (
      <ul className={'pl-2 mt-16 mb-24'}>
        {links.map((link) => {
          const active = location.pathname === link.address;
          const disabled = (!account || !isSupportedChain(chainId)) && link.address !== RoutePath.HOME;
          return (
            <li
              onClick={() => {
                if (!disabled) {
                  navigate(link.address);
                }
              }}
              className={`flex mb-3 items-center transition duration-200  ${
                active ? 'text-primary' : 'text-light-gray-3'
              }
                ${!disabled ? 'hover:text-primary cursor-pointer' : 'cursor-not-allowed'}
               ${link.name === 'Reports' ? 'pl-0.5 gap-4' : 'pl-0 gap-3'}`}
              key={link.name}
            >
              <FontAwesomeIcon style={{ fontSize: 20 }} icon={link.icon}></FontAwesomeIcon>
              <span className={`${active ? '' : 'font-normal'}`}>{link.name}</span>
            </li>
          );
        })}
      </ul>
    ),
    [account, chainId, links, location.pathname, navigate],
  );

  return (
    <div className={''}>

      <nav className={'w-68 px-9 py-10 bg-white rounded-2xl fixed shadow-[0_6px_24px_rgba(0,0,0,0.05)] hidden md:block'}>
        {renderConnector()}
        {menu}
        {account && (
          <div className={'flex justify-center'}>
            <button className={'btn-primary-inverted btn-medium text-center'} onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
          </div>
        )}
      </nav>

      <nav className={'dibs-mobile-nav z-100 block md:hidden fixed w-full text-right right-0 top-0 px-7 py-4 mb-4'}>

        {/*<div onClick={() => {setShow(!show)}} className={'inline-block cursor-pointer'}><FontAwesomeIcon style={{ fontSize: 32, }} icon={faBars}></FontAwesomeIcon></div>*/}
        <div onClick={() => {setShow(!show)}} className={'inline-block z-100 cursor-pointer'}> <input className="checkbox" type="checkbox" name="" id="" />
          <div className="hamburger-lines">
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </div></div>

        <Transition
          as={Fragment}
          show={show}
          enter="transform ease-in-out transition duration-[400ms]"
          enterFrom="opacity-0  translate-x-32"
          enterTo="opacity-100 translate-x-0"
          leave="transform duration-500 transition ease-in-out"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-32"
        >
          <div className={'w-full inset-0 h-screen overflow-y-auto bg-white absolute py-20 px-4'}>
            {renderConnector()}
            {menu}
            {account && (
              <div className={'flex justify-center'}>
                <button className={'btn-primary-inverted btn-medium text-center'} onClick={disconnectWallet}>
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        </Transition>
      </nav>
    </div>
  );
};

export default Sidenav;
