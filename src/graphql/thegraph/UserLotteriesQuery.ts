import graphql from 'babel-plugin-relay/macro';
import useInterval from 'lib/hooks/useInterval';
import { useCallback, useEffect, useState } from 'react';
import { fetchQuery } from 'react-relay';
import { useAppSelector } from 'state/hooks';

import type {
  UserLotteriesQuery as UserLotteriesQueryType,
  UserLotteriesQuery$data,
} from './__generated__/UserLotteriesQuery.graphql';
import environment from './RelayEnvironment';

const query = graphql`
  query UserLotteriesQuery($user: Bytes!, $round: BigInt!) {
    userLotteries(where: { user: $user, round: $round }) {
      id
      user
      round
      tickets
    }
  }
`;

export default function useUserLotteries(user: string | undefined, round: number | undefined, interval: number) {
  const [data, setData] = useState<UserLotteriesQuery$data | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chainId = useAppSelector((state) => state.application.chainId);

  const refreshData = useCallback(() => {
    if (user && chainId) {
      fetchQuery<UserLotteriesQueryType>(environment, query, {
        user,
        round,
      }).subscribe({
        next: setData,
        error: setError,
        complete: () => setIsLoading(false),
      });
    } else {
      setIsLoading(false);
    }
  }, [chainId, round, user]);

  // Trigger fetch on first load
  useEffect(refreshData, [refreshData, user]);

  useInterval(refreshData, interval, true);
  return { error, isLoading, data };
}
