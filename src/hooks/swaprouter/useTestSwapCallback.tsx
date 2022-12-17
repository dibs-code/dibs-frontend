import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumberish } from 'ethers';
import useSwapRouterTransaction from 'hooks/swaprouter/useSwapRouterTransaction';
import { useSwapRouterContract } from 'hooks/useContract';
import React, { ReactNode, useMemo } from 'react';
import { TestSwapTransactionInfo, TransactionType } from 'state/transactions/types';

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
  amountIn: BigNumberish;
  amountOutMin: BigNumberish;
  tokenFrom: string;
  tokenTo: string;
  stable: boolean;
  to: string;
  deadline: BigNumberish;
}): UseCallbackReturns {
  const { account, chainId, provider } = useWeb3React();
  const swapRouterContract = useSwapRouterContract();
  const calls = useMemo(() => {
    const { amountIn, amountOutMin, tokenFrom, tokenTo, stable, to, deadline } = props;
    if (!swapRouterContract || !amountIn || !tokenFrom || !tokenTo || !to) {
      return [];
    }
    return [
      {
        address: swapRouterContract.address,
        calldata:
          swapRouterContract.interface.encodeFunctionData('swapExactTokensForTokensSimple', [
            amountIn,
            amountOutMin,
            tokenFrom,
            tokenTo,
            stable,
            to,
            deadline,
          ]) ?? '',
        value: '0x0',
      },
    ];
  }, [swapRouterContract, props]);

  const info: TestSwapTransactionInfo = {
    type: TransactionType.REWARD,
  };
  const { callback } = useSwapRouterTransaction(account, chainId, provider, calls, info);

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
