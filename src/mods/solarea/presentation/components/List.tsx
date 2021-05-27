import React, { ReactNode } from 'react';

import './list.scss';

type Props = {};

export default function List(props: { txt: string; sgn: string; rowClass: '' }) {
  return (
    <p className={`sol-pres-list-txt ${props.rowClass}`}>
      <span className="sign">{props.sgn}</span>
      <span>{props.txt}</span>
    </p>
  );
}
