import React from 'react';
import { addComponent } from '../../component-db';
import { PresBg } from '../components/PresBg';
import { List } from '../components/List';

import '../presentation.scss';

export default function Page3() {
  return (
    <div className="sol-pres-wr">
      <PresBg />
      <div className="sol-pres-content">
        <h1 className="color-white title-m">Solana is a rising technology</h1>
        <p>
          Solana is one of the most speedy and fast-growing blockchain networks, supported by large
          funds, currently more than $160M in investments and growing. (+$100M planned)*
        </p>
        <List />
      </div>
    </div>
  );
}

addComponent('presentation', 'page3', 'react', {}, Page3);
