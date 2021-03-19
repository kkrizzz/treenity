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
  height?: string;
}

export const Modal = (props: ModalProps) => {
  return props.isVisible?(
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100500,
        width: '100%',
        height: '100%',
        background: props.background || 'rgba(69,69,69,0.34)',
      }}
    >
      <div
        style={{
          marginRight: 'auto',
          marginLeft: 'auto',
          padding: 16,
          background: 'white',
          width: 300,
          height: 'auto',
          top: '30%',
        }}
      >
        <Icon
          name="close"
          style={{width: 'fit-content', marginLeft: 'auto', maxHeight: 10}}
          onClick={() => props.onBackdropPress()}
        />
        {props.children}
      </div>
    </div>
  ):null;
};
