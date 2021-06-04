import * as React from 'react';
import { createPortal } from 'react-dom';
import { ReactNode, useEffect } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  transparent: boolean;
  isVisible: boolean;
  onBackdropPress: Function;
  children?: ReactNode;
  background?: string;
  height?: number | string;
  width?: number | string;
  top?: number | string;
  modalBackground?: string;
  closeBtnColor?: string;
}

export const Modal = (props: ModalProps) => {
  return props.isVisible ? (
    <div
      onClick={() => props.onBackdropPress()}
      style={{
        top: 0,
        position: 'absolute',
        zIndex: 100500,
        width: '100%',
        height: '100%',
        background: props.transparent ? 'transparent' : props.background || 'rgba(69,69,69,0.34)',
      }}
    >
      <div
        style={{
          zIndex: 100501,
          marginRight: 'auto',
          marginLeft: 'auto',
          padding: 16,
          background: props.modalBackground || 'white',
          width: props.width,
          height: props.height,
          position: 'relative',
          top: '15%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Icon
          name="close"
          style={{
            marginTop: -4,
            width: 'fit-content',
            marginLeft: 'auto',
            maxHeight: 24,
            color: props.closeBtnColor || 'black',
          }}
          onClick={() => props.onBackdropPress()}
        />
        {props.children}
      </div>
    </div>
  ) : null;
};
