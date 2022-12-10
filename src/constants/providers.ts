import { JsonRpcProvider } from '@ethersproject/providers';
import { RPC_URLS } from 'constants/networks';

import { SupportedChainId } from './chains';

export const Providers: { [chainId: number]: JsonRpcProvider } = {
  [SupportedChainId.BSC]: new JsonRpcProvider(RPC_URLS[SupportedChainId.BSC]),
};
