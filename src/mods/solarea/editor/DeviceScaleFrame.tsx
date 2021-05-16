import React, { useEffect, useState } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { Icon } from '../components/Icon';

import './DeviceScaleFrame.css';

export const MINIMAL_VIEWPORTS = {
  mobile: {
    icon: 'mobile',
    styles: {
      zoom: 1.2,
      height: '568px',
      width: '320px',
    },
  },
  tablet: {
    icon: 'tablet',
    styles: {
      zoom: 0.7,
      height: '1112px',
      width: '834px',
    },
  },
  desktop: {
    icon: 'desktop',
    styles: {
      zoom: 1,
      height: '100%',
      width: '100%',
    },
  },
};

export const DeviceScaleFrame = ({ children }) => {
  const [iFrameBodyViewport, setIframeBodyViewport] = useState(MINIMAL_VIEWPORTS['mobile']);

  const updateViewport = (viewport) => {
    viewport.styles.transformOrigin = 'top left';
    setIframeBodyViewport(viewport);
  };

  const updateIframe = ({ iframeWindow, iframeDocument }) => {
    //iframeDocument.body.style.zoom = iFrameBodyViewport.styles.zoom;
    iframeDocument.head.querySelectorAll('link').forEach((i) => i.remove());
    iframeWindow.parent.document.querySelectorAll('link[id]').forEach((link) => {
      var newLink = document.createElement('link');
      if (!link.id) return;
      newLink.id = link.id;
      newLink.rel = link.rel;
      newLink.href = link.href;
      iframeDocument.head.appendChild(newLink);
    });
    return null;
  };

  return (
    <>
      <div className="solarea-device-scale-frame-toolbar">
        {Object.keys(MINIMAL_VIEWPORTS).map((key) => {
          return (
            <div
              className="solarea-device-scale-frame-toolbar__item"
              onClick={() => updateViewport(MINIMAL_VIEWPORTS[key])}
            >
              <Icon name={MINIMAL_VIEWPORTS[key].icon} />
            </div>
          );
        })}
        <div className="solarea-device-scale-frame-toolbar__item">
          {iFrameBodyViewport.styles.width}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-space"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 10v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1 -1v-3" />
          </svg>

          {iFrameBodyViewport.styles.height}
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 40px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Frame
          initialContent='<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div id="mountHere"></div></body></html>'
          mountTarget="#mountHere"
          style={{
            ...iFrameBodyViewport.styles,
            border:
              iFrameBodyViewport.styles.width === '100%' ? 'none' : '2px solid rgb(224 224 224)',
          }}
        >
          <FrameContextConsumer>
            {({ window: iframeWindow, document: iframeDocument }) => (
              <>
                {updateIframe({ iframeWindow, iframeDocument })}
                {children}
              </>
            )}
          </FrameContextConsumer>
        </Frame>
      </div>
    </>
  );
};
