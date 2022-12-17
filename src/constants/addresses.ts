import { SupportedChainId } from './chains';

export type AddressMap = { [chainId: number]: string };

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.BSC]: '0xF7bbE3359443565954b0daC61756931581F3699C',
};

export const DIBS_ADDRESS: AddressMap = {
  [SupportedChainId.BSC]: '0x04874d4087E3f611aC555d4Bc1F5BED7bd8B45a0',
};

export const SWAP_ROUTER_ADDRESS: AddressMap = {
  [SupportedChainId.BSC]: '0x9B237893321b2D447E1D1Ae02004ebA30b187D0d',
};
