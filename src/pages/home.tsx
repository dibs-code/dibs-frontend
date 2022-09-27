import { useWeb3React } from '@web3-react/core';
import { getConnection } from 'connection/utils';
import React, { useCallback, useMemo } from 'react';
import { useAppDispatch } from 'state/hooks';
import { updateSelectedWallet } from 'state/user/reducer';
import { shortenAddress } from 'utils/index';

import { injectedConnection } from '../connection';

const Home = () => {
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

  const renderConnector = () => {
    return active ? (
      <p data-testid="wallet-connect">Wallet Connected {shortenAddress(account)}</p>
    ) : (
      <button data-testid="wallet-connect" className={'btn-primary btn-large'} onClick={tryActivation}>
        Connect Wallet
      </button>
    );
  };

  return (
    <div className={'px-24 py-24'}>
      <div>{renderConnector()}</div>
    </div>
  );
};

export default Home; /* Rectangle 18 */
