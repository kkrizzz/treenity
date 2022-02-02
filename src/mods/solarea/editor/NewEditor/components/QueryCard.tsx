import React, { FC } from 'react';
import { styled } from '../SolariaEditTheme';
import { css } from 'styled-components';

interface EndpointCardProps {
  name: string;
  onClick?: () => unknown;
}

const Arrow = () => (
  <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.21967 0.96967C0.512563 0.676777 0.987437 0.676777 1.28033 0.96967L5.78033 5.46967C6.07322 5.76256 6.07322 6.23744 5.78033 6.53033L1.28033 11.0303C0.987437 11.3232 0.512563 11.3232 0.21967 11.0303C-0.0732233 10.7374 -0.0732233 10.2626 0.21967 9.96967L4.18934 6L0.21967 2.03033C-0.0732233 1.73744 -0.0732233 1.26256 0.21967 0.96967Z"
      fill="currentColor"
    />
  </svg>
);

const QueryCard: FC<EndpointCardProps> = ({ name, onClick }) => {
  return (
    <EndpointCardContainer onClick={onClick}>
      {name} <Arrow />
    </EndpointCardContainer>
  );
};

const EndpointCardContainer = styled.div(
  (p) => css`
    box-sizing: border-box;
    display: flex;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;

    background: ${p.theme.colors.fill.secondaryLight};
    color: ${p.theme.colors.text.primary};

    width: 100%;

    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    padding: 15px 10px;

    & > svg {
      margin-left: auto;
    }
  `,
);

export default QueryCard;
