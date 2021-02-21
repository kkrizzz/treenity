import React from 'react';
import '../Dataflow.css';
import { Button, Popover } from 'antd';
import { dataflowBlocks } from '../blocks';

export const DataflowMenuItem = ({ index }) => {
  const handleDragStart = (e) => {
    e.dataTransfer?.setData('text', index);
  };

  const block = dataflowBlocks[index];

  return (
    <div className="dataflow__blocks-menu__search-list__item" draggable onDragStart={handleDragStart}>
      {block.named}
      <Popover
        style={{ maxWidth: 120, background: '#111', color: 'white' }}
        placement="bottom"
        trigger="hover"
        content={block.support}
        title={block.named}
      >
        <Button size="small" type="default">?</Button>
      </Popover>
    </div>
  );
};
