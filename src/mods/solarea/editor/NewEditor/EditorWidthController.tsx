import useEditorStore from '../../stores/editor-store';
import React, { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Icon } from '../../components/Icon';

export const EditorWidthController = () => {
  const [editorMaxWidth, setEditorMaxWidth] = useEditorStore((state) => [
    state.editorMaxWidth,
    state.setEditorMaxWidth,
  ]);

  // const [width, setWidth] = React.useState(680);
  const toggleEditor = useCallback(() => {
    setEditorMaxWidth(editorMaxWidth ? 0 : 680);
  }, [editorMaxWidth, setEditorMaxWidth]);
  useHotkeys('cmd+alt+/,ctrl+alt+/', toggleEditor, [toggleEditor]);
  //
  // useEffect(() => {
  //   setEditorMaxWidth(width);
  // }, [width]);

  return (
    <div
      className="sol-editor-width-controller"
      onClick={() => setEditorMaxWidth(editorMaxWidth ? 0 : 680)}
    >
      <div>
        <Icon name={editorMaxWidth ? 'back_arrow' : 'forward'} />
      </div>
    </div>
  );
};
