import { SupportedChainId } from './chains';

export type AddressMap = { [chainId: number]: string };

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x85D395e783E1e5735B7bd66136D45Df194648EfB',
};

export const DIBS_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0xE8221600C4F0DFd4524219bad2dc66B6F750E444',
};
