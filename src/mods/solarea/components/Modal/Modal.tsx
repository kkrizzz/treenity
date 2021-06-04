import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';
import { Icon } from '../Icon';

export const Modal = ({
  children,
  onClose,
  isOpen,
  header,
}: {
  children: any;
  onClose: any;
  isOpen: boolean;
  header?: any;
}) => {
  const target = useMemo(() => document.createElement('div'), []);
  const modalRoot = useMemo(() => document.getElementById('modal-root'), []);

  useEffect(() => {
    modalRoot!.appendChild(target);
    return () => {
      modalRoot!.removeChild(target);
    };
  }, []);

  if (isOpen) {
    return ReactDOM.createPortal(
      <div className="solarea-modal">
        <div onClick={onClose} className="solarea-modal-backdrop" />
        <div className="solarea-modal-wrapper">
          <div className="solarea-modal-header">
            {header}
            <div onClick={onClose} className="solarea-modal-closebutton">
              <Icon name="squareClose" />
            </div>
          </div>
          <div className="solarea-modal-content">{children}</div>
        </div>
      </div>,
      modalRoot!,
    );
  }

  return null;
};
