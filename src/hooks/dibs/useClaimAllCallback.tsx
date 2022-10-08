import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BalanceObject } from 'hooks/dibs/useDibs';
import { useDibsContract } from 'hooks/useContract';
import React, { ReactNode, useMemo } from 'react';
import { ClaimFeeTransactionInfo, TransactionType } from 'state/transactions/types';

import useDibsTransaction from './useDibsTransaction';

export enum CallbackState {
  INVALID,
  VALID,
}

interface UseCallbackReturns {
  state: CallbackState;
  callback?: () => Promise<TransactionResponse>;
  error?: ReactNode;
}

export default function useClaimAllCallback(balanceToClaim: BalanceObject): UseCallbackReturns {
  const { account, chainId, provider } = useWeb3React();
  const dibsContract = useDibsContract();
  const calls = useMemo(() => {
    if (!dibsContract || !account) return [];
    return [
      {
        address: dibsContract.address,
        calldata:
          dibsContract.interface.encodeFunctionData('claim', [
            balanceToClaim.tokenAddress,
            balanceToClaim.balance,
            account,
          ]) ?? '',
        value: '0x0',
      },
    ];
  }, [account, balanceToClaim, dibsContract]);

  const info: ClaimFeeTransactionInfo = {
    type: TransactionType.CLAIM_FEE,
  };

  const { callback } = useDibsTransaction(account, chainId, provider, calls, info);

  return useMemo(() => {
    if (!provider || !account || !chainId || !callback) {
      return { state: CallbackState.INVALID, error: <div>Missing dependencies</div> };
    }

    return {
      state: CallbackState.VALID,
      callback: async () => callback(),
    };
  }, [provider, account, chainId, callback]);
}
