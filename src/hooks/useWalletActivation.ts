import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { useAppDispatch } from 'state/hooks';
import { updateSelectedWallet } from 'state/user/reducer';
import { removeConnectedWallet } from 'state/wallets/reducer';

import { getConnection, getConnectionName, getIsMetaMask } from '../connection/utils';

export default function useWalletActivation() {
  const dispatch = useAppDispatch();

  const { account, connector } = useWeb3React();
  const disconnectWallet = useCallback(() => {
    const walletType = getConnectionName(getConnection(connector).type, getIsMetaMask());

    if (connector.deactivate) {
      connector.deactivate();
    } else {
      connector.resetState();
    }
    dispatch(updateSelectedWallet({ wallet: undefined }));
    dispatch(removeConnectedWallet({ account, walletType }));
  }, [account, connector, dispatch]);

  return { disconnectWallet };
}
