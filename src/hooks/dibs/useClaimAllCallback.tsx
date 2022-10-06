import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDibs } from 'hooks/dibs/useDibs';
import { useDibsContract } from 'hooks/useContract';
import React, { ReactNode, useMemo } from 'react';
import { ClaimAllTransactionInfo, TransactionType } from 'state/transactions/types';

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

export default function useClaimAllCallback(): UseCallbackReturns {
  const { balancesToClaim } = useDibs();

  const { account, chainId, provider } = useWeb3React();
  const dibsContract = useDibsContract();
  const calls = useMemo(() => {
    if (!dibsContract || !account) return [];
    return balancesToClaim.map((b) => ({
      address: dibsContract.address,
      calldata: dibsContract.interface.encodeFunctionData('claim', [b.tokenAddress, b.balance, account]) ?? '',
      value: '0x0',
    }));
  }, [account, balancesToClaim, dibsContract]);

  const info: ClaimAllTransactionInfo = {
    type: TransactionType.CLAIM_ALL,
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
