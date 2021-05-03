import React from 'react';
import '../SolanaEdit.css';
import { icons } from './icons';

export const Icon = ({ name, ...props }) => {
  return (
    <div {...props} className="custom-solana-icon">
      {icons[name]()}
    </div>
  );
};
