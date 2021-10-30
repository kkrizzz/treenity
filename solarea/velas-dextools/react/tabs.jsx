const Tabs = ({ tabs }) => {
  const [currentName, setCurrentName] = React.useState(tabs[0].name);
  useCSS(
    'tabs.css',
    css`
      .bu-tabs {
        margin-bottom: 0 !important;
      }
      .bu-tabs ul {
        border-color: var(--theme-main-border-color);
      }
      .bu-tabs li {
        color: var(--theme-main-content-color);
        padding: 16px 36px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: -1px;
      }
      .bu-tabs .bu-is-active {
        color: var(--theme-tabs-color) !important;
        border-bottom: 2px solid var(--theme-tabs-color);
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

add(Tabs);
