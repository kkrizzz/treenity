const Switch = ({ className = '', value = false, onChange = () => {}, children }) => {
  useCSS(
    'bu-switch.css',
    css`
      .bu-switch {
        display: flex;
        align-items: center;
        margin: 0;
      }
      .bu-switch__toggle {
        display: inline-block;
        background: var(--theme-card-bg-color);
        padding: 2px;
        border-radius: 100px;
        width: 55px;
        height: 27px;
        cursor: pointer;
        outline: 0;
        margin: 0;
        box-sizing: border-box;
        transition: 0.15s linear background;
      }
      .bu-switch__toggle::before {
        content: '';
        display: inline-block;
        border-radius: 50%;
        background: var(--theme-main-oposit-color);
        width: 23px;
        height: 23px;
        outline: 0;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        transform: translateX(0);
        transition: 0.15s linear transform;
      }
      .bu-switch__toggle--on::before {
        transform: translateX(27px);
      }
      .bu-switch__label {
        font-size: 14px;
        line-height: 1.2;
        font-weight: 300;
        letter-spacing: 0.5px;
        margin: 0 10px 0 0;
      }
    `,
  );

  return (
    <div className={`bu-switch ${className}`}>
      {children && <span className="bu-switch bu-switch__label">{children}</span>}
      <span
        className={`bu-switch bu-switch__toggle ${value ? 'bu-switch__toggle--on' : ''}`}
        onClick={() => onChange(!value)}
        role="button"
        aria-pressed="true"
      />
    </div>
  );
};

add(Switch);
