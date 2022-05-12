import useEditorStore from '../../stores/editor-store';
import React, { useMemo } from 'react';
import { SolareaViewId } from '../../storage-adapters/SolareaViewId';
import { DeviceScaleFrame } from '../DeviceScaleFrame';
import { ErrorBoundary } from '../../../uix/utils/ErrorBoundary';
import Render from '../../render/Render';
import { Preview } from '../Preview';

export const SolareaEditPreview = ({ value: accountData, id, name, ...params }) => {
  const {
    code,
    link,
    selectedContext,
    setCode,
    editorValue,
    editorMaxWidth,
    setEditorMaxWidth,
  } = useEditorStore();

  const linkObj = useMemo(() => SolareaViewId.fromString(link), [link]);
  const isFullscreen = !!editorMaxWidth;
  const toggleFullscreenMode = () => {
    setEditorMaxWidth(editorMaxWidth ? 0 : 680);
  };

  return (
    <div className="sol-markup-preview">
      <ErrorBoundary>
        <DeviceScaleFrame
          onRefresh={() => {
            setCode(editorValue);
          }}
          onToggleFullscreenMode={toggleFullscreenMode}
          isFullscreen={isFullscreen}
        >
          {link ? (
            <ErrorBoundary>
              <Render
                {...params}
                key={linkObj.address}
                id={linkObj.address}
                name={linkObj.name}
                context={linkObj.context}
              />
            </ErrorBoundary>
          ) : (
            code && (
              <Preview
                {...params}
                key={code}
                accountData={accountData}
                code={code}
                id={id}
                name={name}
                context={selectedContext}
              />
            )
          )}
        </DeviceScaleFrame>
      </ErrorBoundary>
    </div>
  );
};
