import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

export default function useGetMuonSignature() {
  const { provider } = useWeb3React();
  return useCallback(
    (user: string | null | undefined, timestamp: number) => {
      if (!provider || !user) {
        return;
      }
      const typedData = {
        types: {
          Message: [
            { type: 'address', name: 'user' },
            { type: 'uint256', name: 'timestamp' },
          ],
        },
        domain: { name: 'Dibs' },
        primaryType: 'Message',
        message: { user, timestamp },
      };
      return provider.getSigner()._signTypedData(typedData.domain, typedData.types, typedData.message);
    },
    [provider],
  );
}
