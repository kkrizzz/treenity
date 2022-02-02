import React from 'react';
import { Icon } from '../../components/Icon';
import { icons } from '../../components/icons';
import { Tooltip } from './components/Tooltip';

type MenuItemProps = {
  icon: keyof typeof icons;
  title: string;
  onClick: () => void;
};

export const MenuItem = ({ title, onClick, icon }: MenuItemProps) => (
  <Tooltip className="sol-edit-menu__item" text={title} onClick={onClick}>
    <Icon name={icon} />
  </Tooltip>
);
