import { isAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import MulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json';
import { useWeb3React } from '@web3-react/core';
import DIBS_ABI from 'abis/dibs.json';
import ERC20_ABI from 'abis/erc20.json';
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json';
import MuonInterfaceV1_ABI from 'abis/MuonInterfaceV1.json';
import SwapRouter_ABI from 'abis/SwapRouter.json';
import { Dibs, Erc20, MuonInterfaceV1, SwapRouter } from 'abis/types';
import { DIBS_ADDRESS, MULTICALL_ADDRESS, MUON_INTERFACE_V1_ADDRESS, SWAP_ROUTER_ADDRESS } from 'constants/addresses';
import { Providers } from 'constants/providers';
import { useMemo } from 'react';

import { UniswapInterfaceMulticall } from '../abis/types/uniswap';

const { abi: MulticallABI } = MulticallJson;

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { provider, account, chainId } = useWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T;
}

export function getProviderOrSigner(library: any, account?: string): any {
  return account ? getSigner(library, account) : library;
}

export function getSigner(library: any, account: string): any {
  return library.getSigner(account).connectUnchecked();
}

export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string,
  targetChainId?: number,
): Contract | null {
  if (!isAddress(address) || address === AddressZero) {
    throw new Error(`Invalid 'address' parameter '${address}'.`);
  }

  let providerOrSigner;
  if (targetChainId) {
    providerOrSigner = getProviderOrSigner(Providers[targetChainId], account);
  } else {
    providerOrSigner = getProviderOrSigner(library, account);
  }

  return new Contract(address, ABI, providerOrSigner) as any;
}

export function useInterfaceMulticall() {
  return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESS, MulticallABI, false) as UniswapInterfaceMulticall;
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function useDibsContract() {
  return useContract<Dibs>(DIBS_ADDRESS, DIBS_ABI, true);
}

export function useSwapRouterContract() {
  return useContract<SwapRouter>(SWAP_ROUTER_ADDRESS, SwapRouter_ABI, true);
}

export function useMuonInterfaceV1Contract() {
  return useContract<MuonInterfaceV1>(MUON_INTERFACE_V1_ADDRESS, MuonInterfaceV1_ABI, true);
}
