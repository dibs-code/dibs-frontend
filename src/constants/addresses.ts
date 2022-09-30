import { SupportedChainId } from './chains';

export type AddressMap = { [chainId: number]: string };

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x85D395e783E1e5735B7bd66136D45Df194648EfB',
};

export const DIBS_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0xc055d389c2758a68e0517036cdf98670175d6f8e',
};
