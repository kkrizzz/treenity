import React, { ReactNode } from 'react';

import './Tooltip.scss';

export default function Tooltip(props: {
  wrapperClassName?: string;
  children: ReactNode;
  title: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  onClick?: () => void;
}) {
  return (
    <div className={props.wrapperClassName} onClick={props.onClick}>
      {props.children}
      <div className={`sol-tooltip ${props.position || 'top'}`}>
        <span>{props.title}</span>
      </div>
    </div>
  );
}
