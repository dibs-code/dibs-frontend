import { Connector } from '@web3-react/types';
import { ConnectionType, injectedConnection } from 'connection';
import { getConnectionName } from 'connection/utils';

import Option from './Option';

const INJECTED_PROPS = {
  color: '#010101',
  id: 'injected',
};

const METAMASK_PROPS = {
  color: '#E8831D',
  id: 'metamask',
};

export function InstallMetaMaskOption() {
  return <Option {...METAMASK_PROPS} header={<>Install MetaMask</>} link={'https://metamask.io/'} />;
}

export function MetaMaskOption({ tryActivation }: { tryActivation: (connector: Connector) => void }) {
  const isActive = injectedConnection.hooks.useIsActive();
  return (
    <Option
      {...METAMASK_PROPS}
      isActive={isActive}
      header={getConnectionName(ConnectionType.INJECTED, true)}
      onClick={() => tryActivation(injectedConnection.connector)}
    />
  );
}

export function InjectedOption({ tryActivation }: { tryActivation: (connector: Connector) => void }) {
  const isActive = injectedConnection.hooks.useIsActive();
  return (
    <Option
      {...INJECTED_PROPS}
      isActive={isActive}
      header={getConnectionName(ConnectionType.INJECTED, false)}
      onClick={() => tryActivation(injectedConnection.connector)}
    />
  );
}
