import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { SupportedChainId } from './chains';

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const RPC_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.BSC]: 'https://bsc-dataseed.binance.org/',
};

export const RPC_PROVIDERS: { [key in SupportedChainId]: StaticJsonRpcProvider } = {
  [SupportedChainId.MAINNET]: new StaticJsonRpcProvider(RPC_URLS[SupportedChainId.MAINNET]),
  [SupportedChainId.RINKEBY]: new StaticJsonRpcProvider(RPC_URLS[SupportedChainId.RINKEBY]),
  [SupportedChainId.BSC]: new StaticJsonRpcProvider(RPC_URLS[SupportedChainId.BSC]),
};
