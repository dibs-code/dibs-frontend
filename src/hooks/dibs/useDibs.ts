import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import DIBS_ABI from 'abis/dibs.json';
import { ZERO_ADDRESS } from 'constants/addresses';
import { useDibsContract } from 'hooks/useContract';
import { useSingleContractMultipleData, useSingleContractWithCallData } from 'lib/hooks/multicall';
import { useMemo } from 'react';

import { Dibs } from '../../abis/types';

const dibsInterface = new Interface(DIBS_ABI);

export type ContractFunctionReturnType<T> = T extends (...args: any) => Promise<infer R>
  ? // TODO: handle struct return type
    R extends [...params: any[]]
    ? any[]
    : R extends void
    ? void
    : R
  : any;

export interface BalanceObject {
  tokenAddress: string;
  balance: BigNumber;
}

export interface AccBalanceObject extends BalanceObject {
  claimedBalance: BigNumber;
}

export function useDibs() {
  const dibsContract = useDibsContract();
  const { account } = useWeb3React();

  const addressToNameCall = useMemo(() => {
    if (!account) return [];
    return [dibsInterface.encodeFunctionData('getCodeName', [account])];
  }, [account]);

  const [addressToNameResult] = useSingleContractWithCallData(dibsContract, addressToNameCall);

  const addressToName: ContractFunctionReturnType<Dibs['callStatic']['getCodeName']> | undefined =
    addressToNameResult?.result?.[0];

  const parentCall = useMemo(() => {
    if (!account) return [];
    return [dibsInterface.encodeFunctionData('parents', [account])];
  }, [account]);

  const [parentResult] = useSingleContractWithCallData(dibsContract, parentCall);

  const parent: ContractFunctionReturnType<Dibs['callStatic']['parents']> | undefined = parentResult?.result?.[0];

  const parentCodeNameCall = useMemo(() => {
    if (!parent || parent === ZERO_ADDRESS) return [];
    return [dibsInterface.encodeFunctionData('getCodeName', [parent])];
  }, [parent]);

  const [parentCodeNameResult] = useSingleContractWithCallData(dibsContract, parentCodeNameCall);

  const parentCodeName: ContractFunctionReturnType<Dibs['callStatic']['getCodeName']> =
    parentCodeNameResult?.result?.[0] || '';

  const userTokensCount = 10;

  const userTokensCall = useMemo(() => {
    if (!account) return [];
    return Array.from(Array(userTokensCount).keys()).map((i) => [account, i]);
  }, [account]);

  const userTokensResult = useSingleContractMultipleData(dibsContract, 'userTokens', userTokensCall);
  const userTokens = useMemo(() => {
    const tokens: string[] = [];
    userTokensResult.forEach((r) => {
      if (r.result) tokens.push(r.result[0]);
    });
    return tokens;
  }, [userTokensResult]);

  const accBalancesCall = useMemo(() => {
    if (!account) return [];
    return userTokens.map((tokenAddress) => [tokenAddress, account]);
  }, [account, userTokens]);

  const accBalancesResult = useSingleContractMultipleData(dibsContract, 'accBalance', accBalancesCall);

  const claimedBalancesCall = useMemo(() => {
    if (!account) return [];
    return userTokens.map((tokenAddress) => [tokenAddress, account]);
  }, [account, userTokens]);

  const claimedBalancesResult = useSingleContractMultipleData(dibsContract, 'claimedBalance', claimedBalancesCall);

  const balances = useMemo((): AccBalanceObject[] => {
    const accBalancesResultLoaded = accBalancesResult.filter((r) => !!r.result);
    if (accBalancesResultLoaded.length < userTokens.length) return [];
    const claimedBalancesResultLoaded = claimedBalancesResult.filter((r) => !!r.result);
    if (claimedBalancesResultLoaded.length < userTokens.length) return [];
    return userTokens.map((tokenAddress, i) => ({
      tokenAddress,
      balance: accBalancesResultLoaded[i]!.result![0],
      claimedBalance: claimedBalancesResultLoaded[i]!.result![0],
    }));
  }, [accBalancesResult, claimedBalancesResult, userTokens]);

  const claimedBalances = useMemo((): BalanceObject[] => {
    return balances.map((b) => ({
      balance: b.claimedBalance,
      tokenAddress: b.tokenAddress,
    }));
  }, [balances]);

  const balancesToClaim = useMemo(() => {
    if (!dibsContract || !account) return [];
    const balancesToClaim: BalanceObject[] = [];
    balances.forEach((b) => {
      const balanceToClaim = BigNumber.from(b.balance).sub(b.claimedBalance);
      if (balanceToClaim && !balanceToClaim.isZero()) {
        balancesToClaim.push({
          tokenAddress: b.tokenAddress,
          balance: balanceToClaim,
        });
      }
    });
    return balancesToClaim;
  }, [account, balances, dibsContract]);

  return { addressToName, parentCodeName, userTokensResult, balances, balancesToClaim, claimedBalances };
}
