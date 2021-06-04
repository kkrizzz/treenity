import React, { CSSProperties } from 'react';
import { icons } from './icons';

type IconProps = {
  name: keyof typeof icons;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};

export const Icon = (props: IconProps) => {
  try {
    return (
      <div {...props} className="custom-solarea-icon">
        {icons[props.name]()}
      </div>
    );
  } catch (e) {
    console.log(e, name);
    return null;
  }
};
