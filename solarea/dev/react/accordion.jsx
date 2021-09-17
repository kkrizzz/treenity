const Icon = () => (
  <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.485283 1L4.97057 5.48528L0.485283 9.97057" stroke="#CCDDEE" />
  </svg>
);

add(({ title, children }) => {
  useCSS(
    'bu-accordion.css',
    css`
      .accordion {
        margin: 2rem auto;
      }
      .accordion-title {
        color: white;
        font-size: 18px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        cursor: pointer;
        align-items: center;
        background-color: #474c5e;
      }

      .accordion-title:hover {
        background-color: #52586d;
      }

      .accordion-title {
        padding: 8px;
      }

      .accordion-content {
        padding-left: 8px;
        padding-right: 8px;
        background-color: #292d3e;
      }
    `,
  );

  const [isActive, setIsActive] = React.useState(false);
  const transform = React.useMemo(() => {
    return isActive ? 'scale(1.1) rotate(90deg)' : 'scale(1.1) rotate(0deg)';
  }, [isActive]);
  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div>
          <Icon
            style={{
              marginRight: 8,
              transform,
              transition: 'transform 0.2s',
            }}
            name="chevronRight"
          />
        </div>
        {title}
      </div>
      {isActive && <div className="accordion-content">{children}</div>}
    </div>
  );
});
