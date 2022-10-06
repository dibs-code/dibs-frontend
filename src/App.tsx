import './App.css';

import { useWeb3React } from '@web3-react/core';
import { isSupportedChain } from 'constants/chains';
import Home from 'pages/home';
import Rewards from 'pages/rewards';
import TestSwap from 'pages/TestSwap';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'state/hooks';

import RoutePath from './routes';

function App() {
  const { chainId } = useWeb3React();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedWallet = useAppSelector((state) => state.user.selectedWallet);
  useEffect(() => {
    const walletNotConnected = !selectedWallet;
    const walletLoadedAndHasWrongChain = chainId && !isSupportedChain(chainId);
    if ((walletNotConnected || walletLoadedAndHasWrongChain) && location.pathname !== RoutePath.HOME) {
      navigate(RoutePath.HOME, { replace: true });
    }
  }, [chainId, location, navigate, selectedWallet]);
  return (
    <Routes>
      <Route path={RoutePath.HOME} element={<Home />} />
      <Route path={RoutePath.REWARDS} element={<Rewards />} />
      <Route path={RoutePath.REPORTS} element={<Home />} />
      <Route path={RoutePath.TEST_SWAP} element={<TestSwap />} />
    </Routes>
  );
}

export default App;
