const Component = ({ tabs }) => {
  const [currentName, setCurrentName] = React.useState(tabs[0].name);
  useCSS(
    'tabs.css',
    css`
      .bu-tabs {
        //margin-bottom: 0 !important;
      }
      .bu-tabs ul {
        border-color: var(--theme-tabs-color);
      }

      .bu-tabs li {
        color: var(--theme-main-content-color) !important;
        border-radius: 12px 12px 0 0;
        padding: 16px 36px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
      }

      .bu-tabs .bu-is-active {
        opacity: 1;
        color: white !important;
        background: var(--theme-tabs-color);
      }
    `,
  );

  return (
    <div>
      <div className="bu-tabs">
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.name}
              onClick={() => setCurrentName(tab.name)}
              className={currentName === tab.name ? 'bu-is-active bu-has-text-primary' : ''}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </div>
      {tabs.find((t) => t.name === currentName)?.content()}
    </div>
  );
};

add(Component);
