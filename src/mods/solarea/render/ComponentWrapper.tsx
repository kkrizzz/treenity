import { useEditorGridLayout } from '../editor/NewEditor/useEditorGridLayout';
import { toast } from '../utils/toast';
import { Icon } from '../components/Icon';
import React from 'react';

export function ComponentWrapper({ id, name, context, children, props, more }) {
  const [, , addGridComponent] = useEditorGridLayout('default~react~default');

  const saveTo = () => {
    addGridComponent(id, name, context, { ...props, ...more });
    toast('Added to grid "default"');
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ top: 0, right: 0, zIndex: 100, position: 'absolute' }} onClick={saveTo}>
        <Icon name="play" />
      </div>
      {children}
    </div>
  );
}
