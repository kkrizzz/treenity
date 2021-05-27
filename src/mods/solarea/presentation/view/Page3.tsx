import React from 'react';
import { addComponent } from '../../component-db';
import { PresBg } from '../components/PresBg';
import List from '../components/List';

import '../presentation.scss';

const listPresentPage3 = [
  {
    txt:
      'cheap transactions and fast execution - more than 50k tps, 0.4 s/block. Visa does around 1,700 transactions per second on average (based on a calculation derived from the official claim of over 150 million transactions per day)',
    rowClass: '',
  },
  {
    txt: 'great developers and a broad community',
    rowClass: '',
  },
  {
    txt: 'high market capitalization, $12,286M. 17th at Coinmarketcap',
    rowClass: '',
  },
  {
    txt:
      'Solana’s crypto-economic system, Storage Rent Economics, perfectly matches our project architecture.',
    rowClass: '',
  },
];

export default function Page3() {
  return (
    <div className="sol-pres-wr">
      <PresBg />
      <div className="sol-pres-content ">
        <div className="sol-pres-row">
          <div className="sol-pres-info">
            <h1 className="title-m">Solana is a rising technology</h1>
            <p>
              Solana is one of the most speedy and fast-growing blockchain networks, supported by
              large funds, currently more than $160M in investments and growing. (+$100M planned)*
            </p>
            <h2 className="sol-pres-list-title">Solana advantages:</h2>

            <ul className="sol-pres-list-ul">
              {listPresentPage3.map((i, idx) => {
                return (
                  <li>
                    <List txt={i.txt} key={idx} rowClass={i.rowClass} />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="sol-pres-img">
            <a href="https://docs.solana.com/" target="_blank">
              <img
                src="/img/presentation/build-screen.png"
                className="build-screen"
                alt="build screen"
                usemap="#workmap"
              />
            </a>
            {/*<map name="workmap">
              <area
                shape="rect"
                coords="124,395,446,440"
                alt="Computer"
                href="https://docs.solana.com/"
                target="_blank"
              />
            </map>*/}
          </div>
        </div>
        <p className="mt30">
          *&nbsp;&nbsp;
          <a
            href="https://www.coindesk.com/solana-development-growth-strategic-investment-funds"
            target="_blank"
          >
            https://www.coindesk.com/solana-development-growth-strategic-investment-funds
          </a>
        </p>
      </div>
    </div>
  );
}

addComponent('presentation', 'page3', 'react', {}, Page3);
