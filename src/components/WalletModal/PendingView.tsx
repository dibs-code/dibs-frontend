import { Connector } from '@web3-react/types';

export default function PendingView({
  connector,
  error = false,
  tryActivation,
  openOptions,
}: {
  connector: Connector;
  error?: boolean;
  tryActivation: (connector: Connector) => void;
  openOptions: () => void;
}) {
  return error ? (
    <>
      <h4>Error connecting</h4>
      <p>The connection attempt failed. Please click try again and follow the steps to connect in your wallet.</p>
      <button
        className={'btn-primary btn-large font-medium mt-4 px-12'}
        onClick={() => {
          tryActivation(connector);
        }}
      >
        Try Again
      </button>
      <button className={'btn-primary btn-large font-medium mt-4 px-12'} onClick={openOptions}>
        Back to wallet selection
      </button>
    </>
  ) : (
    <>
      <p>Waiting to connect</p>
      <p>Confirm this connection in your wallet</p>
    </>
  );
}
