import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import Frame, { FrameContextConsumer, FrameContext } from 'react-frame-component';
import { Icon } from '../components/Icon';
import { StyleSheetManager } from 'styled-components';

import './DeviceScaleFrame.css';
import { css, styled } from './NewEditor/SolariaEditTheme';

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
  const [iFrameBodyViewport, setIframeBodyViewport] = useState(MINIMAL_VIEWPORTS['desktop']);

  const frameRef = useRef<any>();

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

  useLayoutEffect(() => {
    if (!frameRef.current) return;
    const context = frameRef.current.contentWindow;
    globalThis.System.onload = () =>
      updateIframe({ iframeDocument: context.document, iframeWindow: context });
  }, [frameRef.current]);

  return (
    <>
      <StyledPreviewToolbarContainer>
        {Object.keys(MINIMAL_VIEWPORTS).map((key) => {
          return (
            <div
              className={`preview-toolbar__item ${
                iFrameBodyViewport === MINIMAL_VIEWPORTS[key] ? 'preview-toolbar__item_active' : ''
              }`}
              onClick={() => updateViewport(MINIMAL_VIEWPORTS[key])}
            >
              <Icon name={MINIMAL_VIEWPORTS[key].icon} />
            </div>
          );
        })}

        <div className="preview-toolbar__item preview-toolbar__item_bordered">
          {iFrameBodyViewport.styles.width} X {iFrameBodyViewport.styles.height}
        </div>

        <button className="preview-toolbar__full-screen-btn"> Full Screen Preview </button>
      </StyledPreviewToolbarContainer>
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
          ref={(ref) => (frameRef.current = ref)}
          head={<meta name="viewport" content="width=device-width, initial-scale=1.0" />}
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
                <InjectFrameStyles>{children}</InjectFrameStyles>
              </>
            )}
          </FrameContextConsumer>
        </Frame>
      </div>
    </>
  );
};

const InjectFrameStyles = (props) => {
  const { document } = useContext(FrameContext);
  return <StyleSheetManager target={document.body}>{props.children}</StyleSheetManager>;
};

const StyledPreviewToolbarContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.11);
    color: ${theme.colors.text.primary};
    height: 32px;
    width: 100%;
    background: ${theme.colors.fill.secondary};

    .preview-toolbar__item {
      padding: 2px 8px;
      border-radius: 4px;
      color: ${theme.colors.text.primary};
      cursor: pointer;
      align-items: center;
      display: flex;
    }

    .preview-toolbar__item_active {
      background: ${theme.colors.fill.secondaryLight};
    }
    .preview-toolbar__item_bordered {
      border-width: 0 1px 0 1px;
      border-style: solid;
      border-color: ${theme.colors.text.primary};
      color: ${theme.colors.text.secondary};
      border-radius: 0;
      margin: 0 20px 0 20px;
      padding: 0 20px 0 20px;
      cursor: default;
    }
    .preview-toolbar__full-screen-btn {
      width: 136px;
      height: 22px;
      padding: 0;
      border-radius: 4px;
      border: none;
      font-weight: bold;
      font-size: 10px;
      line-height: 10px;
      text-transform: uppercase;
      color: ${theme.colors.text.primary};
      background: ${theme.colors.fill.secondaryLight};
      cursor: pointer;
    }
  `,
);
