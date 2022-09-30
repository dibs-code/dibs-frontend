import { SupportedChainId } from './chains';

export type AddressMap = { [chainId: number]: string };

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x85D395e783E1e5735B7bd66136D45Df194648EfB',
};

export const DIBS_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0xe6a079d866231c011620f37a9f0d80df96a026f0',
};
