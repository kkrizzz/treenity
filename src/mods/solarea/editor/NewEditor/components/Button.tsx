import React, { FC } from 'react';
import { css, styled } from '../SolariaEditTheme';
import Icon from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = styled.button<ButtonProps>(
  ({ theme }) => css`
    cursor: pointer;
    background: ${theme.colors.fill.gradient};
    border: none;
    padding: 8px 16px;

    border-radius: 4px;

    //font
    font-family: Inter;
    font-style: normal;
    font-weight: 900;
    font-size: 12px;
    line-height: 12px;
    text-transform: uppercase;
    color: ${theme.colors.text.primary};
  `,
);

export default Button;
