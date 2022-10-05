import { useWeb3React } from '@web3-react/core'
import React from 'react'

// import { connectorsByName } from '../../utils/connectors'
import Modal from './index'



const WalletModal = (props) => {
  // eslint-disable-next-line react/prop-types
  const { open, hide, closeModal } = props
  const connectorByName = [
    {name: 'MetaMask'},
    {name: 'WalletConnect'},
    {name: 'WalletLink'},]

  const web3React = useWeb3React()
  const { activate } = web3React
  return (
    <Modal closeModal={closeModal} open={open} hide={hide} title="Connect Wallet">
      {connectorByName.map((wallet) => {
        return (
          <div
            className={'btn-primary-inverted rounded-xl mb-3 py-3 cursor-pointer'}
            key={wallet.name}
            // onClick={() => {
            //   activate(connectorsByName[name])
            //   sessionStorage.setItem('walletConnect', true)
            //   localStorage.setItem('walletType', name)
            //   hide()
            // }}
          >
            <div className={'px-5 justify-between items-center w-full flex'} >
              <p>{wallet.name}</p>
              <div className={'bg-white rounded-full p-2 shadow-xl flex justify-center items-center'}>
                {' '}
                <img className={'h-6 w-6'} src={`/${wallet.name}.svg`} />
              </div>
            </div>
          </div>
        )
      })}
    </Modal>
  )
}

export default WalletModal
