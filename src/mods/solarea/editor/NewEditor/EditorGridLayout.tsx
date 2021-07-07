import React, { useCallback, useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './EditorGridLayout.css';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { makeId } from '../../utils/make-id';
import Render from '../../Render';
import { Icon } from '../../components/Icon';

export type LayoutItem = {
  w: number;
  h: number;
  x: number;
  y: number;
  i: string;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  moved?: boolean;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
  isBounded?: boolean;
};

interface EditorLayoutItem {
  id: string; // i in LayoutItem
  props: any;
}

type IEditorGridLayout = {
  viewId: string;
  additionalLayoutInfo: Array<EditorLayoutItem>;
  layout: Array<LayoutItem>;
};

export const EditorGridLayout = ({ id, name, context }) => {
  const viewId = useMemo(() => {
    return makeId(id, name, context);
  }, [id, name, context]);

  const [gridLayout, updateGridLayout] = useLocalStorageState<IEditorGridLayout>(
    `editorGridLayout~${viewId}`,
    { layout: [], additionalLayoutInfo: [], viewId },
  );
  const [targetId, setTargetId] = React.useState('');

  const handleAddItem = () => {
    updateGridLayout((prevState) => {
      const newState = Object.assign({}, prevState);
      newState.additionalLayoutInfo.push({
        id: targetId,
        props: {},
      });

      newState.layout.push({
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        i: targetId,
      });
      return newState;
    });

    setTargetId('');
  };

  const handleChangeLayout = (l) => {
    updateGridLayout((prevState) => {
      const newState = Object.assign({}, prevState);
      newState.layout = l;
      return newState;
    });
  };

  const handleRemoveItem = (item: EditorLayoutItem) => {
    updateGridLayout((prevState) => {
      const newState = Object.assign({}, prevState);
      newState.additionalLayoutInfo.findIndex((i) => i.id == item.id);

      newState.layout.push({
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        i: targetId,
      });
      return newState;
    });
  };

  return (
    <div className="editor-grid-layout">
      <input
        placeholder="Input view id"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
      />
      <button onClick={handleAddItem}>Add</button>
      <GridLayout
        onLayoutChange={(l) => handleChangeLayout(l)}
        className="layout"
        layout={gridLayout.layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        {gridLayout.additionalLayoutInfo.map((i) => {
          return (
            <div className="editor-grid-layout__item" key={i.id}>
              <div
                onClick={() => handleRemoveItem(i)}
                className="editor-grid-layout__item-controls"
              >
                <Icon name="rewind" />
              </div>
              <Render id={i.id} />
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
};
