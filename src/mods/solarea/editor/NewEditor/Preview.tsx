import useEditorStore from '../../stores/editor-store';
import React, { useMemo } from 'react';
import { SolareaViewId } from '../../storage-adapters/SolareaViewId';
import { DeviceScaleFrame } from '../DeviceScaleFrame';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import Render from '../../Render';
import { Preview } from '../Preview';

export const SolareaEditPreview = ({ value, id, name, ...params }) => {
  const [code, link, selectedContext] = useEditorStore((state) => [
    state.code,
    state.link,
    state.selectedContext,
  ]);

  const linkObj = useMemo(() => SolareaViewId.fromString(link), [link]);

  return (
    <div className="sol-markup-preview">
      <DeviceScaleFrame>
        {link ? (
          <ErrorBoundary>
            <Render {...params} key={linkObj.address} {...linkObj} />
          </ErrorBoundary>
        ) : (
          code && (
            <Preview
              {...params}
              key={code}
              accountData={value}
              code={code}
              id={id}
              name={name}
              context={selectedContext}
            />
          )
        )}
      </DeviceScaleFrame>
    </div>
  );
};
