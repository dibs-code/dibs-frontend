import { useWeb3React } from '@web3-react/core';
import Input from 'components/basic/input';
import SubmittedModal from 'components/modal/submitted';
import Sidenav from 'components/navigation/sidenav';
import { DIBS_ADDRESS } from 'constants/addresses';
import { useTestSwapCallback } from 'hooks/dibs/useTestSwapCallback';
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
  const [parentName, setParentName] = useState('');

  const [totalFees, setTotalFees] = useState('0.01');
  const [submittedTxHash, setSubmittedTxHash] = useState<string | null>(null);
  const [totalVolume, setTotalVolume] = useState(10);
  const [tokenAddress, setTokenAddress] = useState('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984');
  const token = useToken(tokenAddress);
  const tokenBalance = useTokenBalance(account ?? undefined, token || undefined);

  const parsedAmount = useMemo(() => tryParseCurrencyAmount(totalFees, token || undefined), [token, totalFees]);

  const insufficientBalance = useMemo(
    () => tokenBalance && parsedAmount && tokenBalance.lessThan(parsedAmount),
    [parsedAmount, tokenBalance],
  );

  const [approvalToken, approveTokenCallback] = useApproveCallback(
    parsedAmount,
    chainId ? DIBS_ADDRESS[chainId] : undefined,
  );

  const { callback: testSwapCallback } = useTestSwapCallback({
    user,
    parentName,
    totalFees: parsedAmount?.quotient.toString() || '0',
    totalVolume,
    token: tokenAddress,
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
    if (!parentName) {
      alert('Parent Code is required');
      return;
    }
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
  }, [loading, parentName, testSwapCallback]);

  function renderButton() {
    const tokenSymbol = token ? token.symbol : 'Unknown';
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
        Swap {token ? token.symbol : 'Unknown'}
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
          <Input
            className={'w-full lg:w-5/12'}
            value={parentName}
            onUserInput={setParentName}
            label={'Parent Code'}
            placeholder={'Enter Code'}
          />
        </section>
        <section className={'mt-2 gap-4 flex flex-col lg:flex-row'}>
          <Input
            type={'number'}
            className={'flex-auto'}
            value={totalFees}
            onUserInput={setTotalFees}
            label={'Total Fees'}
            placeholder={'Enter Amount'}
          />
          <Input
            type={'number'}
            className={'flex-auto'}
            value={totalVolume}
            onUserInput={(val) => setTotalVolume(Number(val))}
            label={'Total Volume'}
            placeholder={'Enter Amount'}
          />
          <Input
            className={'flex-auto'}
            value={tokenAddress}
            onUserInput={setTokenAddress}
            label={'Token Address'}
            placeholder={'Enter Address'}
          />
        </section>
        {renderButton()}
      </main>
    </div>
  );
};

export default TestSwap; /* Rectangle 18 */
