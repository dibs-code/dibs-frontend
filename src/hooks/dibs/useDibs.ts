import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import DIBS_ABI from 'abis/dibs.json';
import { ZERO_ADDRESS } from 'constants/addresses';
import { useDibsContract } from 'hooks/useContract';
import { useSingleContractMultipleData, useSingleContractWithCallData } from 'lib/hooks/multicall';
import { useMemo } from 'react';
import ms from 'ms.macro'

import { Dibs } from '../../abis/types';
import useAccumulativeTokenBalances from "../../graphql/thegraph/AccumulativeTokenBalancesQuery";

const dibsInterface = new Interface(DIBS_ABI);

export enum LotteryStatus {
  UNKNOWN,
  WON,
  LOST,
}

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

  const accumulativeTokenBalances = useAccumulativeTokenBalances(account, ms`30s`)


  const userTokens = useMemo(() => {
    const tokens: string[] = [];
    accumulativeTokenBalances.data?.accumulativeTokenBalances.forEach((atb) => {
      tokens.push(atb.token);
    });
    return tokens;
  }, [accumulativeTokenBalances.data?.accumulativeTokenBalances]);

  const claimedBalancesCall = useMemo(() => {
    if (!account) return [];
    return userTokens.map((tokenAddress) => [tokenAddress, account]);
  }, [account, userTokens]);

  const claimedBalancesResult = useSingleContractMultipleData(dibsContract, 'claimedBalance', claimedBalancesCall);

  const balances = useMemo((): AccBalanceObject[] => {
    if(!accumulativeTokenBalances.data) return []
    const accBalancesResultLoaded = accumulativeTokenBalances.data.accumulativeTokenBalances;
    const claimedBalancesResultLoaded = claimedBalancesResult.filter((r) => !!r.result);
    if (claimedBalancesResultLoaded.length < userTokens.length) return [];
    return userTokens.map((tokenAddress, i) => ({
      tokenAddress,
      balance: BigNumber.from(Number(accBalancesResultLoaded[i].amount) * Math.pow(10, -9)).mul(BigNumber.from(10).pow(9)),
      claimedBalance: claimedBalancesResultLoaded[i]!.result![0],
    }));
  }, [accumulativeTokenBalances.data, claimedBalancesResult, userTokens]);

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

  return { addressToName, parentCodeName, balances, balancesToClaim, claimedBalances };
}

export function useDibsLottery() {
  const dibsContract = useDibsContract();

  const activeLotteryRoundCall = useMemo(() => {
    return [dibsInterface.encodeFunctionData('getActiveLotteryRound', [])];
  }, []);

  const [activeLotteryRoundResult] = useSingleContractWithCallData(dibsContract, activeLotteryRoundCall);

  const activeLotteryRound: ContractFunctionReturnType<Dibs['callStatic']['getActiveLotteryRound']> =
    activeLotteryRoundResult?.result?.[0];

  const firstRoundStartTimeCall = useMemo(() => {
    return [dibsInterface.encodeFunctionData('firstRoundStartTime', [])];
  }, []);

  const [firstRoundStartTimeResult] = useSingleContractWithCallData(dibsContract, firstRoundStartTimeCall);

  const firstRoundStartTime: ContractFunctionReturnType<Dibs['callStatic']['firstRoundStartTime']> =
    firstRoundStartTimeResult?.result?.[0];

  const roundDurationCall = useMemo(() => {
    return [dibsInterface.encodeFunctionData('roundDuration', [])];
  }, []);

  const [roundDurationResult] = useSingleContractWithCallData(dibsContract, roundDurationCall);

  const roundDuration: ContractFunctionReturnType<Dibs['callStatic']['roundDuration']> =
    roundDurationResult?.result?.[0];

  const { account } = useWeb3React();

  const userLotteryTicketsCall = useMemo(() => {
    if (!account || !activeLotteryRound) return [];
    return [dibsInterface.encodeFunctionData('userLotteryTickets', [activeLotteryRound, account])];
  }, [account, activeLotteryRound]);

  const [userLotteryTicketsResult] = useSingleContractWithCallData(dibsContract, userLotteryTicketsCall);

  const userLotteryTickets: ContractFunctionReturnType<Dibs['callStatic']['userLotteryTickets']> =
    userLotteryTicketsResult?.result?.[0] || BigNumber.from(0);

  const lotteryWinnerCall = useMemo(() => {
    if (!activeLotteryRound) return [];
    return [dibsInterface.encodeFunctionData('roundToWinner', [activeLotteryRound - 1])];
  }, [activeLotteryRound]);

  const [lotteryWinnerResult] = useSingleContractWithCallData(dibsContract, lotteryWinnerCall);

  const userLotteryStatus = useMemo(() => {
    if (!account || !lotteryWinnerResult?.result) return LotteryStatus.UNKNOWN;
    const lotteryWinner: ContractFunctionReturnType<Dibs['callStatic']['roundToWinner']> =
      lotteryWinnerResult?.result?.[0];
    if (lotteryWinner === account) return LotteryStatus.WON;
    return LotteryStatus.LOST;
  }, [account, lotteryWinnerResult?.result]);

  return { activeLotteryRound, firstRoundStartTime, roundDuration, userLotteryTickets, userLotteryStatus };
}
