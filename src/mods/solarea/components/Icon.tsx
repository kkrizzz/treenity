import React from 'react';
import { icons } from './icons';

export const Icon = ({ name, ...props }) => {
  return (
    <div {...props} className="custom-solarea-icon">
      {icons[name]()}
    </div>
  );
};
