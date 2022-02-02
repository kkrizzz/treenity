import React, { useMemo, useState } from 'react';
import { Icon } from '../../../components/Icon';
import { styled } from '../SolariaEditTheme';

export const Accordion = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <AccordionContainer isActive={isActive}>
      <div className="accordion__title" onClick={() => setIsActive(!isActive)}>
        <Icon name="chevronDown" />
        {title}
      </div>
      {isActive && <div className="accordion__content">{children}</div>}
    </AccordionContainer>
  );
};

const AccordionContainer = styled.div<{ isActive: boolean }>`
  color: ${(p) => p.theme.colors.text.primary};
  margin-bottom: 10px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;

  .accordion__title {
    font-size: 14px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    cursor: pointer;
    align-items: center;
    background-color: ${(p) => p.theme.colors.fill.secondaryLight};
    padding: 10px 8px;
    border-radius: 4px;

    .custom-solarea-icon {
      padding-right: 8px;
    }

    svg {
      width: 16px;
      height: 16px;
      transition: transform 0.2s linear;
      transform: ${(p) => (p.isActive ? 'scale(1.1) rotate(180deg)' : 'scale(1.1) rotate(0deg)')};
    }
  }

  .accordion__title:hover {
    background-color: #f1f1f11a;
  }

  .accordion__content {
    padding: 10px 8px;
  }
`;
