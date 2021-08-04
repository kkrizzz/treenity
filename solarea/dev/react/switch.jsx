const Switch = ({ className = '', value = false, onChange = () => {}, children }) => {
  useCSS(
    'bu-switch.css',
    `
  .bu-switch {
  display: flex;
  align-items: center;
  margin: 0;
 }
.bu-switch__toggle {
  display: inline-block;
  background: gray;
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
  content: "";
  display: inline-block;
  border-radius: 50%;
  background: white;
  width: 23px;
  height: 23px;
  outline: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  transform: translateX(0);
  transition: 0.15s linear transform;
}
.bu-switch__toggle--on {
  background: black;
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
}`,
  );

  const [active, setActive] = React.useState(value);

  React.useEffect(() => {
    onChange(active);
  }, [active, onChange]);

  return (
    <div className={`bu-switch ${className}`}>
      {children && <span className="bu-switch bu-switch__label">{children}</span>}
      <span
        className={`bu-switch bu-switch__toggle ${active ? 'bu-switch__toggle--on' : ''}`}
        onClick={() => setActive(!active)}
        role="button"
        aria-pressed="true"
      />
    </div>
  );
};

add(Switch);
