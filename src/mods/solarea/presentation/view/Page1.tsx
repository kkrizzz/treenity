import React from 'react';
import { addComponent } from '../../component-db';
import { PresBg } from '../components/PresBg';

import '../presentation.scss';

export default function Page1() {
  return (
    <div className="sol-pres-wr overflow-h">
      <PresBg />
      <div className="logo-block text-center">
        <img src="/img/presentation/logo.svg" className="logo" alt="SOLAREA" />
      </div>
    </div>
  );
}

addComponent('presentation', 'page1', 'react', {}, Page1);
