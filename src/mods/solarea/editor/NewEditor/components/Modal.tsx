import React, { FC } from 'react';
import { css, styled } from '../SolariaEditTheme';
import Icon from './Icon';

interface ModalProps {
  isVisible: boolean;
  onClose?: () => any;
}

const Modal: FC<ModalProps> = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <StyledModalContainer onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close-btn" onClick={onClose}>
          <Icon name="cross" />
        </button>

        {children}
      </div>
    </StyledModalContainer>
  );
};

const StyledModalContainer = styled.div(
  ({ theme }) => css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.3);

    .modal__content {
      position: relative;
      margin: 15% auto 0 auto;
      border-radius: 10px;
      padding: 16px 12px;
      min-width: 400px;
      min-height: 50px;
      max-width: 80vw;
      width: min-content;
      background: ${theme.colors.fill.secondaryLight};
      color: ${theme.colors.text.primary};
    }

    .modal__close-btn {
      position: absolute;
      right: 0;
      top: -40px;
      background: transparent;
      border: none;
      color: ${theme.colors.text.primary};
      cursor: pointer;
      padding: 4px;
    }
  `,
);

export default Modal;
