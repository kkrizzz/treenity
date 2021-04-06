import React from 'react';
import { PropsWithChildren } from 'react';

interface PopoverProps {}

const BurgerIcon = (props) => {
  return (
    <div style={{ width: 24 }} {...props}>
      <svg fill="#111" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M28,10H4A1,1,0,0,1,4,8H28a1,1,0,0,1,0,2Z" />
        <path d="M28,17H4a1,1,0,0,1,0-2H28a1,1,0,0,1,0,2Z" />
        <path d="M28,24H4a1,1,0,0,1,0-2H28a1,1,0,0,1,0,2Z" />
      </svg>
    </div>
  );
};

export const Popover = (props: PropsWithChildren<PopoverProps>) => {
  const [isMin, setIsMin] = React.useState(true);
  const { children } = props;

  return (
    <div style={{ zIndex: 500000, position: 'absolute', top: '1%', right: '1%', width: 'fit-content' }}>
      {isMin ? (
        <BurgerIcon onClick={() => setIsMin(false)} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
          <BurgerIcon onClick={() => setIsMin(true)} />
          <div style={{ background: 'black' }}>{children}</div>
        </div>
      )}
    </div>
  );
};
