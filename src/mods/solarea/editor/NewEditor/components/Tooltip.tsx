import React from 'react';

import { styled } from '../SolariaEditTheme';

export const Tooltip = ({ children, text, className, onClick }: any) => {
  return (
    <TooltipContainer className={className} onClick={onClick}>
      {children}
      <span className="solarea-tooltip__text">{text}</span>
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted #343434; /* If you want dots under the hoverable text */

  .solarea-tooltip__text {
    visibility: hidden;
    width: 200%;
    background-color: #343434;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    font-size: 12px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    top: 4px;
    left: 95%;
    z-index: 1;
  }

  &:hover {
    .solarea-tooltip__text {
      visibility: visible;
    }
  }
`;
