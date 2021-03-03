import React from 'react';
import '../Dataflow.css';
import { Button, Popover } from 'antd';

export const DataflowMenuItem = ({ _t }) => {
    const handleDragStart = (e) => {
        e.dataTransfer?.setData('text', _t);
    };
    return (
        <div className="dataflow__blocks-menu__list__item" draggable onDragStart={handleDragStart}>
            {_t}
        </div>
    );
};
