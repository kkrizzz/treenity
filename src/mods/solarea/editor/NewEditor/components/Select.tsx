import React, { FC } from 'react';
import { styled } from '../SolariaEditTheme';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const Select: FC<SelectProps> = ({ label, style, children, ...props }) => {
  return (
    <InputContainer style={style}>
      <label>
        <span>{label}</span>
        <select {...props}>{children}</select>
      </label>
    </InputContainer>
  );
};

const InputContainer = styled.div`
  margin: 4px 0;
  span {
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 8px;
    line-height: 8px;
    text-transform: uppercase;
  }
  select {
    margin-top: 2px;
    color: ${(p) => p.theme.colors.text.primary};
    background: transparent;
    display: block;
    width: 100%;

    padding: 6px 12px 6px 8px;
    border: 1px solid rgba(241, 241, 241, 0.1);
    box-sizing: border-box;
    border-radius: 4px;
    outline: none;

    &:focus {
      border-color: ${(p) => p.theme.colors.text.primary};
      color: ${(p) => p.theme.colors.text.primary};
    }
  }
`;

export default Select;
