const Component = ({ tabs }) => {
  const [currentTab, setCurrentTab] = React.useState(tabs[0]);

  return (
    <div>
      <div className="bu-tabs">
        <ul>
          {tabs.map((tab) => (
            <li
              onClick={() => setCurrentTab(tab)}
              className={`${
                currentTab.name === tab.name ? 'bu-is-active bu-has-text-primary' : ''
              }`}
            >
              <a>{tab.name}</a>
            </li>
          ))}
        </ul>
      </div>
      {tabs.find((i) => i.name === currentTab.name).content()}
    </div>
  );
};

add(Component);
