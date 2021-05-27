import React, { ReactNode } from 'react';

import './list.scss';

type Props = {};

export default function ListIcon(props: {
  wrapperClassName?: string;
  children: ReactNode;
  txt: string;
}) {
  return (
    <div className="sol-pres-list-icon">
      {props.children}
      <p className="sol-pres-list-icon-txt">
        <span>{props.txt}</span>
      </p>
    </div>
  );
}
