import { BigNumber } from '@ethersproject/bignumber';
import { keccak256 } from '@ethersproject/keccak256';
import { TransactionResponse } from '@ethersproject/providers';
import { toUtf8Bytes } from '@ethersproject/strings';
import { useWeb3React } from '@web3-react/core';
import { useDibsContract } from 'hooks/useContract';
import React, { ReactNode, useMemo } from 'react';
import { RewardTransactionInfo, TransactionType } from 'state/transactions/types';

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

export function useTestSwapCallback(props: {
  user: string;
  parentName: string;
  totalFees: number;
  totalVolume: number;
  token: string;
}): UseCallbackReturns {
  const { account, chainId, provider } = useWeb3React();
  const dibsContract = useDibsContract();
  const calls = useMemo(() => {
    const { user, parentName, totalFees, totalVolume, token } = props;
    if (!dibsContract || !user || !parentName || !totalFees || !totalVolume || !token) {
      return [];
    }
    const parentCode = keccak256(toUtf8Bytes(parentName));
    return [
      {
        address: dibsContract.address,
        calldata:
          dibsContract.interface.encodeFunctionData('reward', [
            user,
            parentCode,
            BigNumber.from(totalFees * 1000).mul(BigNumber.from(10).pow(15)),
            totalVolume,
            token,
          ]) ?? '',
        value: '0x0',
      },
    ];
  }, [dibsContract, props]);

  const info: RewardTransactionInfo = {
    type: TransactionType.REWARD,
    parentName: props.parentName,
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
