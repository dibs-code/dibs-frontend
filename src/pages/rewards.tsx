// import {faCopy} from "@fortawesome/pro-regular-svg-icons";
import { faCircleDollarToSlot, faGift, faTicket } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CurrencyAmount } from '@uniswap/sdk-core';
import Modal from 'components/modal';
import Sidenav from 'components/navigation/sidenav';
import useClaimAllCallback from 'hooks/dibs/useClaimAllCallback';
import { BalanceObject, LotteryStatus, useDibs, useDibsLottery } from 'hooks/dibs/useDibs';
import { useToken } from 'hooks/Tokens';
import JSBI from 'jsbi';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const AccBalance = (props: { obj: BalanceObject }) => {
  const token = useToken(props.obj.tokenAddress);
  const balance = useMemo(() => {
    if (!token) return '';
    const amount = JSBI.BigInt(props.obj.balance.toString());
    return CurrencyAmount.fromRawAmount(token, amount).toSignificant(5);
  }, [props.obj.balance, token]);
  return (
    <h2>
      {balance} {token?.symbol}
    </h2>
  );
};

const NoBalance = () => {
  return <h2>0 USDC</h2>;
};

const ClaimRow = (props: { obj: BalanceObject }) => {
  const token = useToken(props.obj.tokenAddress);
  const balance = useMemo(() => {
    if (!token) return '';
    const amount = JSBI.BigInt(props.obj.balance.toString());
    return CurrencyAmount.fromRawAmount(token, amount).toSignificant(5);
  }, [props.obj.balance, token]);

  const { callback: claimAllCallback } = useClaimAllCallback(props.obj);

  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const claim = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await claimAllCallback?.();
    } catch (e) {
      console.log('swap failed');
      console.log(e);
    }
    if (mounted.current) {
      setLoading(false);
    }
  }, [loading, claimAllCallback]);

  function getLogoSrc(symbol: string | null | undefined) {
    if (symbol && ['eth', 'uni', 'usdc'].includes(symbol.toLowerCase())) {
      return `/${symbol.toLowerCase()}-logo.svg`;
    }
    return 'eth-logo.svg';
  }

  return (
    <li className={'flex justify-between rounded-xl  items-center m-3 bg-primary-light px-4 py-3'}>
      <div className={'flex items-center gap-4'}>
        {/* shadow-[0px 4px 10px rgba(0, 0, 0, 0.08)] */}
        <div className={'p-2 rounded-full shadow-xl bg-white'}>
          <img className={'w-8 h-8'} src={getLogoSrc(token?.symbol || 'eth')} alt={'token'} />
        </div>
        <p className={'text-xl font-semibold'}>{balance + ' ' + token?.symbol}</p>
      </div>
      <div>
        <button className={`btn-medium btn-primary ${loading ? 'btn-waiting' : ''}`} onClick={claim}>
          {loading ? 'Waiting to Confirm' : 'Claim'}
        </button>
      </div>
    </li>
  );
};
const Rewards = () => {
  const { balancesToClaim, claimedBalances } = useDibs();
  const { userLotteryStatus } = useDibsLottery();

  const wonLottery = useMemo(() => userLotteryStatus === LotteryStatus.WON, [userLotteryStatus]);

  const prePrize = false;

  // Mock variable for type of reward (nft / token)
  // const [isNFT, setIsNFT] = useState(false);

  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }

  const { activeLotteryRound, firstRoundStartTime, roundDuration, userLotteryTickets } = useDibsLottery();

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  useEffect(() => {
    const diffTime =
      firstRoundStartTime && activeLotteryRound && roundDuration
        ? firstRoundStartTime + (activeLotteryRound + 1) * roundDuration - Math.floor(now.getTime() / 1000)
        : 0;
    const diff = {
      seconds: String(diffTime % 60).padStart(2, '0'),
      minutes: String(Math.floor(diffTime / 60) % 60).padStart(2, '0'),
      hours: String(Math.floor(diffTime / 3600) % 24).padStart(2, '0'),
      days: String(Math.floor(diffTime / 86400)).padStart(2, '0'),
    };
    setSeconds(diff.seconds);
    setMinutes(diff.minutes);
    setHours(diff.hours);
    setDays(diff.days);
  }, [now, activeLotteryRound, firstRoundStartTime, roundDuration]);

  return (
    <div className={'px-40 py-14'}>
      <Modal className={'!max-w-lg'} title={'Claimable Fee List'} open={open} closeModal={closeModal}>
        {balancesToClaim.length ? (
          balancesToClaim.map((b) => <ClaimRow key={b.tokenAddress} obj={b} />)
        ) : (
          <p className={'flex justify-between rounded-xl  items-center m-3 bg-primary-light px-4 py-3'}>
            Nothing to claim
          </p>
        )}
      </Modal>
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
                <div className={'bg-cf relative bg-cover px-8 pt-6 pb-4 w-96 h-[256px] rounded-2xl'}>
                  <label className={'text-22 mb-2 block relative font-light'}>
                    Claimable fees {/*<button*/}
                    {/*  onClick={() => setOpen(true)}*/}
                    {/*  className={'btn-small btn-link absolute -right-2 -top-0.5'}*/}
                    {/*>{`Claim separately ->`}</button>*/}
                  </label>
                  {balancesToClaim.length ? (
                    balancesToClaim.map((b) => <AccBalance key={b.tokenAddress} obj={b} />)
                  ) : (
                    <NoBalance />
                  )}
                  <footer className={' absolute right-8 bottom-7 pt-1 text-right'}>
                    {balancesToClaim.length ? (
                      <button className={'btn-medium btn-primary'} onClick={() => setOpen(true)}>
                        Claim
                      </button>
                    ) : null}
                  </footer>
                </div>

                <div className={'bg-tf relative bg-cover pl-8 pr-4 pt-6 pb-4 w-96 h-[256px] rounded-2xl'}>
                  <label className={'text-22 mb-2 inline-block font-light'}>Total fees claimed</label>
                  {claimedBalances.length ? (
                    claimedBalances.map((b) => <AccBalance key={b.tokenAddress} obj={b} />)
                  ) : (
                    <NoBalance />
                  )}
                  <footer className={'absolute right-4 bottom-6 pt-1 text-right'}>
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
                <div className={'lottery-card  px-12 py-8'}>
                  <section className={'flex justify-between '}>
                    <div className={''}>
                      <h4 className={'mb-6'}>
                        You have {userLotteryTickets.toNumber()} tickets for this week&apos;s lottery
                      </h4>
                      {userLotteryStatus !== LotteryStatus.UNKNOWN && (
                        <div>
                          <p className={'text-sm font-normal text-dark-gray-2'}>Last week result</p>
                          <p className={'text-lg'}>
                            {wonLottery ? 'Congrats! You won the prize' : `Unfortunately, You didn't win the prize`}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <div
                        className={'px-4 py-4 bg-white rounded-xl shadow-lottery-inner-card'}
                        style={{ width: 233.83 }}
                      >
                        <p className={'mb-2'}>Next draw in</p>
                        <p className={'font-normal text-4xl'}>{`${days}:${hours}:${minutes}:${seconds}`}</p>
                      </div>
                    </div>
                  </section>

                  <section className={'flex justify-between items-end '}>
                    <div>
                      <img src={'/lottery-img.png'} className={'w-44 relative right-4'} alt="lottery" />
                      {prePrize && (
                        <div className={'inline-flex gap-2 mt-4 items-center px-3 py-2 bg-primary-light rounded-lg '}>
                          <FontAwesomeIcon style={{ fontSize: 20 }} icon={faGift}></FontAwesomeIcon>
                          <p className={'font-normal'}>
                            It seems you didn’t claim <button>your previous prize (2 Items)</button>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={'pt-6'}>
                      <div className={'px-4 py-4 bg-white rounded-xl shadow-lottery-inner-card'}>
                        {!wonLottery ? (
                          <div className={'flex flex-col py-0.5 gap-3 items-center'}>
                            <img src={'/sad-robo.png'} className={'w-22 '} alt="lottery lost" />
                            <p className={'font-normal text-gray px-0.5'}>There is nothing to claim</p>
                          </div>
                        ) : (
                          <div className={'flex flex-col gap-4 items-center py-2'}>
                            <img src={'/prize-token.png'} className={'w-20 '} alt="lottery prize" />
                            <h4 className={'font-semibold px-7'}>3203.20 USDC</h4>
                            <button className={'btn-medium btn-primary'}>Claim Your Prize</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </main>
            </section>
          </main>
        </>
      </main>
    </div>
  );
};

export default Rewards; /* Rectangle 18 */
