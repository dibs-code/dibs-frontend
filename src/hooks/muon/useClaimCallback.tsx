import { BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from '@ethersproject/bytes';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BalanceToClaimObject } from 'hooks/dibs/useDibs';
import { useMuonInterfaceV1Contract } from 'hooks/useContract';
import React, { ReactNode, useMemo } from 'react';
import { ClaimFeeTransactionInfo, TransactionType } from 'state/transactions/types';

import { MuonClientBase } from '../../abis/types/MuonInterfaceV1';
import { MuonVerificationData } from '../../types';
import useMuonTransaction from './useMuonTransaction';

export enum CallbackState {
  INVALID,
  VALID,
}

interface UseCallbackReturns {
  state: CallbackState;
  callback?: () => Promise<TransactionResponse>;
  error?: ReactNode;
}

export default function useClaimCallback(
  balanceToClaim: BalanceToClaimObject,
  muonVerificationData: MuonVerificationData | null,
): UseCallbackReturns {
  const { account, chainId, provider } = useWeb3React();
  const muonContract = useMuonInterfaceV1Contract();
  const calls = useMemo(() => {
    if (!muonContract || !account || !muonVerificationData) return [];
    const params: [
      string,
      string,
      string,
      BigNumberish,
      BigNumberish,
      BytesLike,
      MuonClientBase.SchnorrSignStruct,
      BytesLike,
    ] = [
      account,
      balanceToClaim.tokenAddress,
      account,
      balanceToClaim.accumulativeBalance.toString(),
      balanceToClaim.balance.toString(),
      muonVerificationData.result.reqId,
      {
        signature: muonVerificationData.result.signatures[0].signature,
        owner: muonVerificationData.result.signatures[0].owner,
        nonce: muonVerificationData.result.data.init.nonceAddress,
      },
      muonVerificationData.result.shieldSignature,
    ];
    return [
      {
        address: muonContract.address,
        calldata: muonContract.interface.encodeFunctionData('claim', params) ?? '',
        value: '0x0',
      },
    ];
  }, [
    account,
    balanceToClaim.accumulativeBalance,
    balanceToClaim.balance,
    balanceToClaim.tokenAddress,
    muonContract,
    muonVerificationData,
  ]);

  const info: ClaimFeeTransactionInfo = {
    type: TransactionType.CLAIM_FEE,
  };

  const { callback } = useMuonTransaction(account, chainId, provider, calls, info);

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
