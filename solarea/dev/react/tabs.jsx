const Component = ({ tabs }) => {
  const [currentName, setCurrentName] = React.useState(tabs[0].name);

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
              <a>{tab.name}</a>
            </li>
          ))}
        </ul>
      </div>
      {tabs.find((t) => t.name === currentName)?.content()}
    </div>
  );
};

add(Component);
