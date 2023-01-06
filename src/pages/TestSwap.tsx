import { useWeb3React } from '@web3-react/core';
import Input from 'components/basic/input';
import SubmittedModal from 'components/modal/submitted';
import Sidenav from 'components/navigation/sidenav';
import { SWAP_ROUTER_ADDRESS } from 'constants/addresses';
import { useTestSwapCallback } from 'hooks/swaprouter/useTestSwapCallback';
import { useToken } from 'hooks/Tokens';
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback';
import { useTokenBalance } from 'hooks/useCurrencyBalance';
import tryParseCurrencyAmount from 'lib/utils/tryParseCurrencyAmount';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TestSwap = () => {
  const { account, chainId } = useWeb3React();

  const [user, setUser] = useState('');
  useEffect(() => {
    if (account) {
      setUser(account);
    }
  }, [account]);

  const [amountIn, setAmountIn] = useState('0.0000001');
  const [submittedTxHash, setSubmittedTxHash] = useState<string | null>(null);
  const [tokenFromAddress, setTokenFromAddress] = useState('0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56');
  const tokenFrom = useToken(tokenFromAddress);
  const tokenBalance = useTokenBalance(account ?? undefined, tokenFrom || undefined);
  const [tokenToAddress, setTokenToAddress] = useState('0x55d398326f99059fF775485246999027B3197955');
  const tokenTo = useToken(tokenToAddress);

  const parsedAmount = useMemo(() => tryParseCurrencyAmount(amountIn, tokenFrom || undefined), [tokenFrom, amountIn]);
  const parsedAmountOut = useMemo(
    () => tryParseCurrencyAmount(String(Number(amountIn) * 0.8), tokenFrom || undefined),
    [tokenFrom, amountIn],
  );

  const insufficientBalance = useMemo(
    () => tokenBalance && parsedAmount && tokenBalance.lessThan(parsedAmount),
    [parsedAmount, tokenBalance],
  );

  const [approvalToken, approveTokenCallback] = useApproveCallback(
    parsedAmount,
    chainId ? SWAP_ROUTER_ADDRESS[chainId] : undefined,
  );

  const { callback: testSwapCallback } = useTestSwapCallback({
    amountIn: parsedAmount?.quotient.toString() || '0',
    amountOutMin: parsedAmountOut?.quotient.toString() || '0',
    to: user || '',
    deadline: 1970418853,
    stable: true,
    tokenFrom: tokenFromAddress,
    tokenTo: tokenToAddress,
  });

  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const swap = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const tx = await testSwapCallback?.();
      if (tx) {
        setSubmittedTxHash(tx.hash);
      }
    } catch (e) {
      console.log('swap failed');
      console.log(e);
    }
    if (mounted.current) {
      setLoading(false);
    }
  }, [loading, testSwapCallback]);

  function renderButton() {
    const tokenSymbol = tokenFrom ? tokenFrom.symbol : 'Unknown';
    const tokenToSymbol = tokenTo ? tokenTo.symbol : 'Unknown';
    if (insufficientBalance) {
      return (
        <button className={'btn-primary btn-large font-medium mt-6 px-12'}>Insufficient {tokenSymbol} balance</button>
      );
    }
    if (approvalToken === ApprovalState.NOT_APPROVED) {
      return (
        <button className={'btn-primary btn-large font-medium mt-6 px-12'} onClick={approveTokenCallback}>
          Approve {tokenSymbol}
        </button>
      );
    }
    if (approvalToken === ApprovalState.PENDING) {
      return (
        <button className={'btn-primary btn-large font-medium mt-6 px-12 btn-waiting'}>Waiting for Approve...</button>
      );
    }
    if (approvalToken === ApprovalState.UNKNOWN) {
      return <button className={'btn-primary btn-large font-medium mt-6 px-12'}>Loading Approval State...</button>;
    }
    if (loading) {
      return <button className={'btn-primary btn-large font-medium mt-6 px-12 btn-waiting'}>Waiting to Confirm</button>;
    }
    return (
      <button className={`btn-primary btn-large font-medium mt-6 px-12`} onClick={swap}>
        Swap {tokenSymbol} to {tokenToSymbol}
      </button>
    );
  }

  return (
    <div className={'page-spacing'}>
      <SubmittedModal
        hash={submittedTxHash}
        closeModal={() => {
          setSubmittedTxHash(null);
        }}
      ></SubmittedModal>{' '}
      <Sidenav></Sidenav>
      <main className={'main-spacing'}>
        <header className={'border-b pb-4 mb-16'}>
          <h2>Test Swap</h2>
        </header>
        <section className={'mt-8 gap-4 flex flex-col lg:flex-row'}>
          <Input
            className={'w-full lg:w-7/12'}
            value={user}
            onUserInput={setUser}
            label={'User Address'}
            placeholder={'Enter Address'}
          />

        </section>
        <section className={'mt-2 gap-4 flex flex-col lg:flex-row'}>
          <Input
            type={'number'}
            className={'flex-auto'}
            value={amountIn}
            onUserInput={setAmountIn}
            label={'Amount In'}
            placeholder={'Enter Amount'}
          />
          <Input
            className={'flex-auto'}
            value={tokenFromAddress}
            onUserInput={setTokenFromAddress}
            label={'From Token Address'}
            placeholder={'Enter Address'}
          />
          <Input
            className={'flex-auto'}
            value={tokenToAddress}
            onUserInput={setTokenToAddress}
            label={'To Token Address'}
            placeholder={'Enter Address'}
          />
        </section>
        {renderButton()}
      </main>
    </div>
  );
};

export default TestSwap; /* Rectangle 18 */
