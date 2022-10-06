// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
import { faCircleDollarToSlot, faTicket } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CurrencyAmount } from '@uniswap/sdk-core';
import Sidenav from 'components/navigation/sidenav';
import { BalanceToClaimObject, useDibs } from 'hooks/dibs/useDibs';
import { useToken } from 'hooks/Tokens';
import JSBI from 'jsbi';
import React, { useMemo } from 'react';

const BalanceToClaim = (props: { obj: BalanceToClaimObject }) => {
  const token = useToken(props.obj.tokenAddress);
  const balance = useMemo(() => {
    if (!token) return '';
    const amount = JSBI.BigInt(props.obj.balance.toString());
    return CurrencyAmount.fromRawAmount(token, amount).toSignificant(5);
  }, [props.obj.balance, token]);
  return (
    <h2>
      {balance} {token?.symbol}{' '}
    </h2>
  );
};

const Rewards = () => {
  const { balancesToClaim } = useDibs();

  return (
    <div className={'px-40 py-14'}>
      <Sidenav></Sidenav>
      <main className={'pl-84'}>
        <>
          <header className={'border-b pb-4 mb-16'}>
            <h2>Rewads</h2>
          </header>

          <main>
            <section className={'mb-20'}>
              <header
                className={
                  'text-black items-center mb-8 px-6 py-2 bg-white inline-flex gap-4 inline-block rounded-lg shadow-header'
                }
              >
                <FontAwesomeIcon style={{ fontSize: 24 }} icon={faCircleDollarToSlot}></FontAwesomeIcon>
                <p className={'text-22 mt-0.5'}>Earned Fees</p>
              </header>
              <main className={'flex justify-between'}>
                <div className={'bg-cf bg-cover px-8 pt-6 pb-4 w-96 h-[256px] rounded-2xl'}>
                  <label className={'text-22 mb-2 block relative font-light'}>
                    Claimable fees{' '}
                    <button className={'btn-small btn-link absolute -right-2 -top-0.5'}>{`Claim separately ->`}</button>
                  </label>
                  {balancesToClaim.map((b) => (
                    <BalanceToClaim key={b.tokenAddress} obj={b} />
                  ))}
                  <footer className={'mt-20 pt-1 text-right'}>
                    {balancesToClaim.length ? <button className={'btn-medium btn-primary'}>Claim All</button> : null}
                  </footer>
                </div>

                <div className={'bg-tf bg-cover pl-8 pr-4 pt-6 pb-4 w-96 h-[256px] rounded-2xl'}>
                  <label className={'text-22 mb-2 inline-block font-light'}>Total fees claimed</label>
                  <h2>29.03 USDC</h2>
                  <footer className={'mt-20 pt-1 text-right'}>
                    <button className={'btn-medium text-lg btn-link'}>{`Claim History ->`}</button>
                  </footer>
                </div>
              </main>
            </section>

            <section>
              <header
                className={
                  'text-black items-center mb-6 px-6 py-2 bg-white inline-flex gap-4 inline-block rounded-lg shadow-header'
                }
              >
                <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTicket}></FontAwesomeIcon>
                <p className={'text-22 mt-0.5'}>Lottery Tickets</p>
              </header>
              <main>
                <p className={'mb-2 pl-1'}>[A brief explaination about how this works and what you should do ]</p>
                <div className={'bg-lottery rounded-2xl h-96 px-24'}></div>
              </main>
            </section>
          </main>
        </>
      </main>
      {/*<div>{renderConnector()}*/}
      {/*</div>*/}
    </div>
  );
};

export default Rewards; /* Rectangle 18 */
