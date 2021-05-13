import React, { useState } from 'react';
import './Accordion.css';
import { Icon } from './Icon';

export const Accordion = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div>
          <Icon style={{ transform: 'scale(0.8)' }} name={isActive ? 'chevronUp' : 'chevronDown'} />
        </div>
        {title}
      </div>
      {isActive && <div className="accordion-content">{children}</div>}
    </div>
  );
};
