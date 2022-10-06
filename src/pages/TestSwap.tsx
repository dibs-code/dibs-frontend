import { useWeb3React } from '@web3-react/core';
import Input from 'components/basic/input';
import Sidenav from 'components/navigation/sidenav';
import { useTestSwapCallback } from 'hooks/dibs/useTestSwapCallback';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const TestSwap = () => {
  const { account } = useWeb3React();

  const [user, setUser] = useState('');
  useEffect(() => {
    if (account) {
      setUser(account);
    }
  }, [account]);
  const [parentName, setParentName] = useState('');

  const [totalFees, setTotalFees] = useState(1);
  const [totalVolume, setTotalVolume] = useState(1000);
  const [token, setToken] = useState('0x7af963cf6d228e564e2a0aa0ddbf06210b38615d');
  const { callback: testSwapCallback } = useTestSwapCallback({
    user,
    parentName,
    totalFees,
    totalVolume,
    token,
  });

  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const create = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await testSwapCallback?.();
    } catch (e) {
      console.log('swap failed');
      console.log(e);
    }
    if (mounted.current) {
      setLoading(false);
    }
  }, [loading, testSwapCallback]);

  return (
    <div className={'px-40 py-14'}>
      <Sidenav></Sidenav>
      <main className={'pl-84'}>
        <section className={'mt-8 gap-4 display-flex flex flex-wrap'}>
          <Input
            className={'flex-auto'}
            value={user}
            onUserInput={setUser}
            label={'User Address'}
            placeholder={'Enter Address'}
          />
          <Input
            className={'flex-auto'}
            value={parentName}
            onUserInput={setParentName}
            label={'Parent Code'}
            placeholder={'Enter Code'}
          />
          <Input
            type={'number'}
            className={'flex-auto'}
            value={totalFees}
            onUserInput={(val) => setTotalFees(Number(val))}
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
            value={token}
            onUserInput={setToken}
            label={'Token Address'}
            placeholder={'Enter Address'}
          />
          <button className={'btn-primary btn-large font-medium mt-6 px-12'} onClick={create}>
            Swap
          </button>
        </section>
      </main>
    </div>
  );
};

export default TestSwap; /* Rectangle 18 */
