import React, { ReactNode } from 'react';

import './list.scss';

type Props = {};

export default function List(props: { txt: string }) {
  return (
    <p className="sol-pres-list-txt">
      <span>{props.txt}</span>
    </p>
  );
}
