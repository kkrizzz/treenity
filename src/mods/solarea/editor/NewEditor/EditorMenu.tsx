import React from 'react';
import { Icon } from '../../components/Icon';
import { icons } from '../../components/icons';
import { Tooltip } from './Tooltip';

type MenuItemProps = {
  icon: keyof typeof icons;
  title: string;
  onClick: () => void;
};

export const MenuItem = ({ title, onClick, icon }: MenuItemProps) => (
  <Tooltip className="sol-menu-item" text={title} onClick={onClick}>
    <Icon name={icon} />
  </Tooltip>
);
