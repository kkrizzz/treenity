import React, { useCallback } from 'react';
import './Drawer.css';
import { Icon } from './Icon';
import { useHotkeys } from 'react-hotkeys-hook';

const WIDTH = 300;

export const Drawer = ({ children }) => {
  const [width, setWidth] = React.useState(0);
  const toggleDrawer = useCallback(() => setWidth((width) => (width > 0 ? 0 : WIDTH)), [setWidth]);
  // useHotkeys('/', toggleDrawer);

  return (
    <>
      <div className="solarea-drawer" style={{ width }}>
        <div className="solarea-drawer-closebtn acc" onClick={toggleDrawer}>
          <Icon name="close" />
        </div>
        {children}
      </div>
      <div className="solarea-drawer-openbtn" onClick={toggleDrawer}>
        <Icon name="burger" />
      </div>
    </>
  );
};
