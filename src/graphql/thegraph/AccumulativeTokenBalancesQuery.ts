import graphql from 'babel-plugin-relay/macro'
import useInterval from 'lib/hooks/useInterval'
import { useCallback, useEffect, useState } from 'react'
import { fetchQuery } from 'react-relay'
import { useAppSelector } from 'state/hooks'

import type {
  AccumulativeTokenBalancesQuery as AccumulativeTokenBalancesQueryType,
  AccumulativeTokenBalancesQuery$data,
} from './__generated__/AccumulativeTokenBalancesQuery.graphql'
import environment from './RelayEnvironment'

const query = graphql`
  query AccumulativeTokenBalancesQuery($user: Bytes!) {
    accumulativeTokenBalances(where: {user: $user}) {
      id
      user
      token
      amount
    }
  }
`


export default function useAccumulativeTokenBalances(user: string | undefined, interval: number) {
  const [data, setData] = useState<AccumulativeTokenBalancesQuery$data | null>(null)
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const chainId = useAppSelector((state) => state.application.chainId)

  const refreshData = useCallback(() => {
    if (user && chainId) {
      fetchQuery<AccumulativeTokenBalancesQueryType>(environment, query, {
        user: user.toLowerCase(),
      }).subscribe({
        next: setData,
        error: setError,
        complete: () => setIsLoading(false),
      })
    } else {
      setIsLoading(false)
    }
  }, [chainId, user])

  // Trigger fetch on first load
  useEffect(refreshData, [refreshData, user])

  useInterval(refreshData, interval, true)
  return { error, isLoading, data }
}
