import React, { useMemo, useState } from 'react';
import './Accordion.css';
import { Icon } from './Icon';

export const Accordion = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);
  const transform = useMemo(() => {
    return isActive ? 'scale(1.1) rotate(90deg)' : 'scale(1.1) rotate(0deg)';
  }, [isActive]);
  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div>
          <Icon
            style={{
              marginRight: 8,
              transform,
              transition: 'transform 0.2s',
            }}
            name="chevronRight"
          />
        </div>
        {title}
      </div>
      {isActive && <div className="accordion-content">{children}</div>}
    </div>
  );
};
