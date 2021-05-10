import React from 'react';

import './menuMarkup.scss';
import { Icon } from '../../components/Icon';
import Tooltip from '../../components/Tooltip';

type Props = {};

const menuItems = [
  {
    icon: 'burger2',
    title: 'Menu',
    onClick: () => {
      console.log('qwe');
    },
  },
  {
    icon: 'reload',
    title: 'Reload',
    onClick: () => {
      console.log('qwe');
    },
  },
  {
    icon: 'save',
    title: 'Save',
    onClick: () => {
      console.log('qwe');
    },
  },
  {
    icon: 'play',
    title: 'Start',
    onClick: () => {
      console.log('qwe');
    },
  },
  {
    icon: 'rewind',
    title: 'Rewind',
    onClick: () => {
      console.log('qwe');
    },
  },
];

const menuItemsSub = [
  {
    icon: 'info',
    title: 'Information',
    onClick: () => {
      console.log('qwe');
    },
  },
  {
    icon: 'settings',
    title: 'Settings',
    onClick: () => {
      console.log('qwe');
    },
  },
];

export function MenuMarkup({}: Props) {
  return (
    <div className="sol-menu-markup">
      <ul className="sol-menu-markup-list">
        {menuItems.map((item, key) => {
          return (
            <li>
              <Tooltip
                wrapperClassName="sol-btn-menu-markup sol-tooltip-wr"
                title={item.title}
                position="right"
                key={key}
                onClick={item.onClick}
              >
                <Icon name={item.icon} />
              </Tooltip>
            </li>
          );
        })}
      </ul>

      <ul className="sol-menu-markup-list-sub">
        {menuItemsSub.map((i, idx) => {
          return (
            <li>
              <Tooltip
                wrapperClassName="sol-btn-menu-markup sol-tooltip-wr"
                title={i.title}
                position="right"
                key={idx}
                onClick={i.onClick}
              >
                <Icon name={i.icon} />
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
