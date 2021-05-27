import React from 'react';
import { addComponent } from '../../component-db';
import { PresBg } from '../components/PresBg';

import '../presentation.scss';

export default function Page1() {
  return (
    <div className="sol-pres-wr">
      <PresBg />
      <div className="sol-pres-content text-center">
        <div className="sol-pres-logo-block">
          <img src="/img/presentation/logo.svg" className="logo" alt="SOLAREA" />
        </div>
        <h1 className="title-x">
          Decentralized apps composer and <br />
          Community Driven Blockchain Explorer <br />
          based on Solana
          <img src="/img/presentation/sol-icon.svg" className="title-icon" alt="icon" />
        </h1>
      </div>
    </div>
  );
}

addComponent('presentation', 'page1', 'react', {}, Page1);
