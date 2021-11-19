const getContent = (content) => {
  if (typeof content === 'string') return <>{content}</>;

  return content({});
};

const DropDown = ({ options = [], defaultValue, onChange, value }) => {
  const dropDownContainerRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [privateCurrentOption, setCurrentOption] = React.useState(
    options.find((option) => option.value === defaultValue),
  );
  const currentOption = value
    ? options.find((option) => option.value === value)
    : privateCurrentOption;
  const filteredOptions = query ? options.filter(({ text }) => text.includes(query)) : options;

  const handleClickOutside = (e) => {
    if (isOpen && dropDownContainerRef && !dropDownContainerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const onOptionClick = (option) => {
    if (onChange) onChange(option.value);
    if (!value) setCurrentOption(option);
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <DropDownContainer
      className={isOpen ? 'dropdown__container_open' : ''}
      ref={dropDownContainerRef}
    >
      <div
        className="dropdown__main"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {currentOption ? getContent(currentOption.content) : ''}
      </div>
      <div className="dropdown__options">
        <input
          className="dropdown__search"
          value={query}
          placeholder="Filter"
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />

        {filteredOptions.map((option) => (
          <div className="dropdown__option" onClick={() => onOptionClick(option)}>
            {getContent(option.content)}
          </div>
        ))}
      </div>
    </DropDownContainer>
  );
};

const DropDownContainer = styled.div`
  position: relative;
  width: max-content;
  user-select: none;

  .dropdown__search {
    background: transparent;
    outline: none;
    border: none;
    border-bottom: solid ${({ theme }) => theme.addOpacity(theme.colors.linkColor, 50)} 1px;
    margin: 8px 16px;
  }

  & > .dropdown__main {
    position: relative;
    width: 100%;
    min-width: 140px;
    background: var(--theme-card-bg-color);
    color: var(--theme-main-color);
    padding: 16px 16px;
    cursor: pointer;
    border-radius: 6px;
  }

  &.dropdown__container_open > .dropdown__main {
    border-radius: 6px 6px 0 0;
    border-bottom: solid ${({ theme }) => theme.colors.linkColor} 1px;
  }

  & > .dropdown__main:after {
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    border-left: solid 2px;
    border-bottom: solid 2px;
    border-color: var(--theme-a-hover-color);
    right: 16px;
    top: calc(50% - 5.15px);
    transform: rotate(-45deg);
  }

  &.dropdown__container_open > .dropdown__main:after {
    top: calc(50% - 2.6px);
    transform: rotate(135deg);
  }

  & > .dropdown__options {
    width: 100%;
    position: absolute;
    z-index: 10;
    display: none;
    background: var(--theme-card-bg-color);
    color: var(--theme-main-color);
    flex-direction: column;
    cursor: pointer;
    border-radius: 0 0 6px 6px;
    padding: 8px 0;
    max-height: 400px;
    overflow: auto;
    //perspective: 1000px;

    transform-origin: top;
    animation: growDown 300ms ease-in-out forwards;
    //animation: growDown 300ms ease-in-out forwards;
  }

  &.dropdown__container_open > .dropdown__options {
    display: flex;
  }

  .dropdown__option {
    background: var(--theme-card-bg-color);
    padding: 8px 16px;
    transition: filter 100ms linear;
  }

  .dropdown__option:hover {
    filter: brightness(130%);
  }

  @keyframes growDown {
    0% {
      transform: scaleY(0);
    }
    80% {
      transform: scaleY(1.1);
    }
    100% {
      transform: scaleY(1);
    }
  }
`;

add(DropDown);
