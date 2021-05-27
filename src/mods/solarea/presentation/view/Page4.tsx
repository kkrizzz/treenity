import React from 'react';
import { addComponent } from '../../component-db';
import { PresBg } from '../components/PresBg';
import List from '../components/List';

import '../presentation.scss';

const listPresentPage4 = [
  {
    txt: 'There are more than 1200 NFT implementations in existence.',
    rowClass: '',
  },
  {
    txt:
      'People spent more than $2 billion on non-fungible tokens, or NFTs, during the first quarter of 2021',
    rowClass: '',
  },
  {
    txt:
      'NFT can be utilized as unfalsifiable storage of sensitive content, as revolutionary as the emergence of HTTPS and SSL',
    rowClass: '',
  },
  {
    txt:
      'NFTs are designed to safeguard sensitive data by saving it on-chain. However, often the UI/UX implementation is a weak point, compromising the security of blockchain networks, allowing attackers access to the user’s sensitive data and funds.',
    rowClass: '',
  },
  {
    sgn: '* ',
    txt: 'Solarea is not another NFT-project',
    rowClass: 'sol-pres-special-color',
  },
  {
    sgn: '** ',
    txt: 'https://www.coindesk.com/q1-2021-industry-trends-nfts-defi-gains',
    rowClass: 'sol-pres-special-color sol-pres-link',
  },
];

export default function Page4() {
  return (
    <div className="sol-pres-wr page4">
      <PresBg />
      <div className="sol-pres-content">
        <div className="sol-pres-title-block">
          <h1 className="title-m">The rise of NFT</h1>
          <p>
            <span>$2B / Q1 spent</span>**
          </p>
        </div>
        <div className="sol-pres-row">
          <div className="sol-pres-info">
            <ul className="sol-pres-list-ul">
              {listPresentPage4.map((i, idx) => {
                return (
                  <li>
                    <List txt={i.txt} key={idx} rowClass={i.rowClass} sgn={i.sgn} />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="sol-pres-img">
            <img src="/img/presentation/cat.png" className="cat-screen" alt="cat screen" />
          </div>
        </div>
      </div>
    </div>
  );
}

addComponent('presentation', 'page4', 'react', {}, Page4);
