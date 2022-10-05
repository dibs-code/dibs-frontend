import './App.css';

import { useWeb3React } from '@web3-react/core';
import { isSupportedChain } from 'constants/chains';
import Home from 'pages/home';
import TestSwap from 'pages/TestSwap';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import RoutePath from './routes';

function App() {
  const { account, chainId } = useWeb3React();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if ((!account || !isSupportedChain(chainId)) && location.pathname !== RoutePath.HOME) {
      navigate(RoutePath.HOME);
    }
  }, [account, chainId, location.pathname, navigate]);
  return (
    <Routes>
      <Route path={RoutePath.HOME} element={<Home />} />
      <Route path={RoutePath.REWARDS} element={<Home />} />
      <Route path={RoutePath.REPORTS} element={<Home />} />
      <Route path={RoutePath.TEST_SWAP} element={<TestSwap />} />
    </Routes>
  );
}

export default App;
