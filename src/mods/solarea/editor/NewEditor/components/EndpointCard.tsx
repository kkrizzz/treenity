import React, { FC } from 'react';
import { styled } from '../SolariaEditTheme';
import { css } from 'styled-components';

interface EndpointCardProps {
  title: string;
  name: string;
  description: string;
  onClick?: () => unknown;
}

const EndpointCard: FC<EndpointCardProps> = ({ title, name, description, onClick }) => {
  return (
    <EndpointCardContainer onClick={onClick}>
      <div className="endpoint-card__title">{title}</div>
      <div className="endpoint-card__footer">
        <div className="endpoint-card__name">{name}</div>
        <div className="endpoint-card__description">{description}</div>
      </div>
    </EndpointCardContainer>
  );
};

const EndpointCardContainer = styled.div(
  (p) => css`
    font-family: Inter;
    font-style: normal;
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.05);
    background: ${p.theme.colors.fill.secondaryDark};
    width: 300px;
    height: 178px;

    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;

    .endpoint-card__title {
      width: 100%;
      height: 100px;
      border-radius: 10px;

      background: linear-gradient(102.64deg, #151622 -4.22%, #1b1e38 105.17%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      font-weight: 800;
      font-size: 18px;
      line-height: 18px;
      color: ${p.theme.colors.text.primary};
    }

    .endpoint-card__footer {
      padding: 16px;
    }
    .endpoint-card__name {
      font-weight: bold;
      font-size: 12px;
      line-height: 12px;
      color: ${p.theme.colors.text.primary};
      padding-bottom: 10px;
    }
    .endpoint-card__description {
      font-weight: normal;
      font-size: 10px;
      line-height: 10px;
      color: ${p.theme.colors.text.primary};
      opacity: 0.4;
    }
  `,
);

export default EndpointCard;
