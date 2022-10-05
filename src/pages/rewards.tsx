// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
import {faCircleDollarToSlot, faTicket } from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useWeb3React } from '@web3-react/core';
import Sidenav from "components/navigation/sidenav";
import { getConnection } from 'connection/utils';
import React, { useCallback, useMemo } from 'react';
import { useAppDispatch } from 'state/hooks';
import { updateSelectedWallet } from 'state/user/reducer';

import { injectedConnection } from '../connection';
// import Input from "components/basic/input";
// import {isSupportedChain} from "constants/chains";

const Rewards = () => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const active = useMemo(() => !!account, [account]);

  const tryActivation = useCallback(async () => {
    const connector = injectedConnection.connector;
    const connectionType = getConnection(connector).type;
    try {
      await connector.activate();
      dispatch(updateSelectedWallet({ wallet: connectionType }));
    } catch (error: any) {
      console.debug(`web3-react connection error: ${error}`);
    }
  }, [dispatch]);



  return (
    <div className={'px-40 py-14'}>
      <Sidenav></Sidenav>
      <main className={'pl-84'}>
        <>
          <header className={'border-b pb-4 mb-16'}>
            <h2>Rewads</h2>
          </header>

            <main>
              <section className={'mb-24'}>
                <header className={'text-black items-center mb-8 px-6 py-2 bg-white inline-flex gap-4 inline-block rounded-lg shadow-header'}>
                  <FontAwesomeIcon style={{ fontSize: 24 }} icon={faCircleDollarToSlot}></FontAwesomeIcon>
                  <p className={'text-22 mt-0.5'}>Earned Fees</p>
                </header>
                <main className={'flex justify-between'}>

                  <div className={'bg-cf bg-cover px-8 pt-6 pb-4 w-96 h-[256px] rounded-2xl'}>
                    <label className={'text-22 mb-2 block relative font-light'}>Claimable fees <button className={'btn-small btn-link absolute -right-2 -top-0.5'}>{`Claim separately ->`}</button> </label>
                    <h2>29.03 USDC</h2>
                    <footer className={'mt-20 pt-1 text-right'}>
                      <button className={'btn-medium btn-primary'}>Claim All</button>
                    </footer>
                  </div>

                  <div className={'bg-tf bg-cover pl-8 pr-4 pt-6 pb-4 w-96 h-[256px] rounded-2xl'}>
                    <label className={'text-22 mb-2 inline-block font-light'}>Total fees claimed</label>
                    <h2>29.03 USDC</h2>
                    <footer className={'mt-20 pt-1 text-right'}>
                      <button className={'btn-medium text-lg btn-link'}>{`Claim History ->`}</button>
                    </footer>
                  </div>

                </main>
              </section>

              <section>
                <header className={'text-black items-center mb-8 px-6 py-2 bg-white inline-flex gap-4 inline-block rounded-lg shadow-header'}>
                  <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTicket}></FontAwesomeIcon>
                  <p className={'text-22 mt-0.5'}>Lottery Tickets</p>
                </header>
                <main></main>
              </section>

              <div className={'rounded-2xl text-xl bg-nocode bg-cover'}>
                <p className={'text-2xl font-normal h-64 px-24 text-center flex justify-center items-center'}>
                  You didn’t create your dibs code yet,<br></br>
                  Create one and start earning!
                </p>
              </div>


            </main>
          
        </>
      </main>
      {/*<div>{renderConnector()}*/}
      {/*</div>*/}
    </div>
  );
};

export default Rewards; /* Rectangle 18 */
