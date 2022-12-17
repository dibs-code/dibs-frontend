import { keccak256 } from '@ethersproject/keccak256';
import { TransactionResponse } from '@ethersproject/providers';
import { toUtf8Bytes } from '@ethersproject/strings';
import { useWeb3React } from '@web3-react/core';
import { useDibsContract } from 'hooks/useContract';
import React, { ReactNode, useMemo } from 'react';
import { RegisterTransactionInfo, TransactionType } from 'state/transactions/types';

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

export function useRegisterCallback(name: string, parentName: string): UseCallbackReturns {
  const { account, chainId, provider } = useWeb3React();
  const dibsContract = useDibsContract();
  const calls = useMemo(() => {
    if (!dibsContract || !account || !name) {
      return [];
    }
    const parentCode = keccak256(toUtf8Bytes(parentName));
    return [
      {
        address: dibsContract.address,
        calldata: dibsContract.interface.encodeFunctionData('register', [account, name, parentCode]) ?? '',
        value: '0x0',
      },
    ];
  }, [dibsContract, account, name, parentName]);

  const info: RegisterTransactionInfo = {
    type: TransactionType.REGISTER,
    name,
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
