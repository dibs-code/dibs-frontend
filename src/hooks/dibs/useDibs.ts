import { Interface } from '@ethersproject/abi';
import { useWeb3React } from '@web3-react/core';
import DIBS_ABI from 'abis/dibs.json';
import { useDibsContract } from 'hooks/useContract';
import { useSingleContractWithCallData } from 'lib/hooks/multicall';
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

export function useDibs() {
  const dibsContract = useDibsContract();
  const { account, provider } = useWeb3React();
  const addressToCodeCall = useMemo(() => {
    if (!account) return [];
    return [dibsInterface.encodeFunctionData('addressToCode', [account])];
  }, [account]);

  const [addressToCodeResult] = useSingleContractWithCallData(dibsContract, addressToCodeCall);
  const addressToCode: ContractFunctionReturnType<Dibs['callStatic']['addressToCode']> | undefined =
    addressToCodeResult?.result?.[0];

  return { addressToCode };
}
