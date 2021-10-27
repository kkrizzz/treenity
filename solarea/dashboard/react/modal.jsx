add(function Modal({ children, visible, onClose }) {
  useCSS(
    'modal.css',
    css`
      .bu-modal-content {
        background: var(--theme-card-bg-color);
        min-height: 60vh;
        border-radius: 12px;
      }
    `,
  );

  return (
    <div className={`bu-modal ${visible ? 'bu-is-active' : ''}`}>
      <div className="bu-modal-background" onClick={onClose} />
      <div className="bu-modal-content">{children}</div>
      <button className="bu-modal-close bu-is-large" aria-label="close" onClick={onClose} />
    </div>
  );
});
