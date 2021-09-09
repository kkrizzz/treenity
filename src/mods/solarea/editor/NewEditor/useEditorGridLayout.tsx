import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { IEditorGridLayout } from './gridLayoutTypes';

export function useEditorGridLayout(
  viewId: string,
): [IEditorGridLayout, any, (targetId: string, name: string, context: string, props: any) => void] {
  const [gridLayout, updateGridLayout] = useLocalStorageState<IEditorGridLayout>(
    `editorGridLayout~${viewId}`,
    { layout: [], additionalLayoutInfo: [], viewId },
  );

  const handleAddItem = (targetId: string, name: string, context: string, props) => {
    updateGridLayout((prevState) => {
      const newState = Object.assign({}, prevState);
      newState.additionalLayoutInfo.push({
        id: targetId,
        name,
        context,
        props,
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
  };

  return [gridLayout, updateGridLayout, handleAddItem];
}
