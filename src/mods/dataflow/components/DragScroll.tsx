import React, { ReactElement, ReactNode } from 'react';
import { is } from 'immer/dist/utils/common';

export interface DragScrollProps {
  onScroll?: (e: MouseEvent) => void;
  style?: React.CSSProperties;
  zoomRate: number;
  dragRate: number;
  children: ReactElement;
}

export const DragScroll = (props: DragScrollProps) => {
  const container = React.useRef<HTMLDivElement>(null);

  const { zoomRate, dragRate, style, children } = props;
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [lastCoord, setLastCoord] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  function onMouseUp(e: any) {
    if (isDragging) {
      setIsDragging(false);
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function onMouseDown(e: any) {
    if (!isDragging) {
      setIsDragging(true);
      setLastCoord({ x: e.clientX, y: e.clientY });
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onWheel(e) {
    const zoom = Number(container.current.style.zoom) || 1;
    if (e.deltaY > 0) {
      if (zoom < 1) container.current.style.zoom = `${zoom + 0.1}`;
    } else {
      if (zoom > 0.5) container.current.style.zoom = `${zoom - 0.1}`;
    }
  }

  function onScroll(e) {
  }

  function onMouseMove(e: any) {
    if (isDragging) {
      const { clientX, clientY } = e;
      container.current.scrollLeft -= dragRate * (-lastCoord.x + clientX);
      container.current.scrollTop -= dragRate * (-lastCoord.y + clientY);

      setLastCoord({ x: clientX, y: clientY });
      e.stopPropagation();
      e.preventDefault();
    }
  }

  return (
    <div
        ref={container}
        className="feddot-dragscroll"
        onScroll={onScroll}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
    >
      {React.cloneElement(children, {...children.props, style})}
    </div>
  );
};
