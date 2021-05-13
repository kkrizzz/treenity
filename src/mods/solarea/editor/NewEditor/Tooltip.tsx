import React from 'react';

import './Tooltip.css';

export const Tooltip = ({ children, text, className, onClick }: any) => {
  return (
    <div className={`solarea-tooltip ${className ? className : ''}`} onClick={onClick}>
      {children}
      <span className="solarea-tooltiptext">{text}</span>
    </div>
  );
};
