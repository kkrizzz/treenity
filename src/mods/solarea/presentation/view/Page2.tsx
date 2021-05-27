import React from 'react';
import { addComponent } from '../../component-db';
import { PresBg } from '../components/PresBg';

import '../presentation.scss';

export default function Page2() {
  return (
    <div className="sol-pres-wr">
      <PresBg />
      <div className="sol-pres-content">
        <h1 className="color-white title-m">Market Overview</h1>
        <p>
          Blockchains are growing rapidly: in users, volume, turnover, and market capitalization.
          More than 100 million people are involved in crypto, but only a tiny part of them use
          smart contracts and DAPPs.
        </p>
        <p className="bold">
          e.g., MetaMask still has less than 6 millions frequent users, and there is a lot of space
          to grow
        </p>
      </div>
    </div>
  );
}

addComponent('presentation', 'page2', 'react', {}, Page2);
