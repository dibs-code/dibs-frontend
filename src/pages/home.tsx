import YourCode from 'components/dashboard/YourCode';
import Sidenav from 'components/navigation/sidenav';
import React from 'react';

const Home = () => {
  return (
    <div className={'px-40 py-14'}>
      <Sidenav></Sidenav>
      <main className={'pl-84'}>
        <YourCode></YourCode>
      </main>
    </div>
  );
};

export default Home; /* Rectangle 18 */
