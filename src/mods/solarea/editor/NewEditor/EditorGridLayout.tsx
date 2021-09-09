import React, { useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './EditorGridLayout.css';
import { makeId } from '../../utils/make-id';
import Render from '../../Render';
import { Icon } from '../../components/Icon';
import { useEditorGridLayout } from './useEditorGridLayout';
import { EditorLayoutItem } from './gridLayoutTypes';

export const EditorGridLayout = ({ id, name, context }) => {
  const viewId = useMemo(() => {
    return makeId(id, name, context);
  }, [id, name, context]);

  const [targetId, setTargetId] = React.useState('');

  const [gridLayout, updateGridLayout, addGridItem] = useEditorGridLayout(viewId);

  const handleAddItem = () => {
    addGridItem(targetId, 'default', 'react', {});
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
              <Render {...i.props} id={i.id} context={i.context} name={i.name} />
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
};

export default EditorGridLayout;
