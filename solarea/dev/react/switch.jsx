const Switch = ({ className = '', value = false, onChange = () => {}, children }) => {
  return (
    <StyledSwitchContainer className={className}>
      {children && <span className="switch__label">{children}</span>}
      <span
        className={`switch__toggle ${value ? 'switch__toggle_on' : ''}`}
        onClick={() => onChange(!value)}
        role="button"
        aria-pressed="true"
      />
    </StyledSwitchContainer>
  );
};

add(Switch);

const StyledSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0;

  .switch__toggle {
    display: inline-block;
    background: var(--theme-switch-bg-color, --theme-card-bg-color);
    padding: 2px;
    border-radius: 100px;
    width: 55px;
    height: 27px;
    cursor: pointer;
    outline: 0;
    margin: 0;
    box-sizing: border-box;
    transition: 0.15s linear background;

    &:before {
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

    &_on:before {
      transform: translateX(27px);
    }
  }
  .switch__label {
    font-size: 14px;
    line-height: 1.2;
    font-weight: 300;
    letter-spacing: 0.5px;
    margin: 0 8px 0 0;
  }
`;
