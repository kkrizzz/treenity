import React from 'react';

import './list.scss';

type Props = {};

export function List({}: Props) {
  return (
    <div className="sol-pres-list">
      <h4 className="sol-pres-list-title bold">Solana advantages:</h4>
      <ul>
        <li>
          <span>
            cheap transactions and fast execution - more than 50k tps, 0.4 s/block. Visa does around
            1,700 transactions per second on average (based on a calculation derived from the
            official claim of over 150 million transactions per day)
          </span>
        </li>
        <li>
          <span>great developers and a broad community</span>
        </li>
      </ul>
    </div>
  );
}
