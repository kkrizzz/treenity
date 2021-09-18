const inputTypes = {
  string: ({ id, name, defaultValue }) => (
    <input
      name={id}
      defaultValue={defaultValue}
      placeholder={`Input ${name}`}
      className="bu-input"
      type="text"
    />
  ),
  select: ({ id, name, defaultValue, options }) => (
    <div style={{ display: 'block' }} className="bu-select">
      <select
        style={{ width: '100%' }}
        name={id}
        defaultValue={defaultValue}
        placeholder={`Input ${name}`}
      >
        {options.map(({ value, text }) => (
          <option value={value}>{text}</option>
        ))}
      </select>
    </div>
  ),
};

add(function EditForm({ componentID, propValues, onSave, onSaveText = 'Save' }) {
  useCSS(
    'edit-component.css',
    css`
      .edit-component {
        padding: 16px 16px 8px 16px;
      }
      .edit-component button {
        position: absolute;
        right: 8px;
        bottom: 8px;
      }
      .edit-component-prop {
        margin-bottom: 8px;
      }

      .edit-component-prop span {
        text-transform: capitalize;
      }
    `,
  );
  const [props, setProps] = React.useState(null);
  React.useEffect(() => {
    require(`solarea://dashboard/${componentID}/components`).then((r) => setProps(r.props));
  }, [componentID]);

  if (!props) return <div>Loading</div>;

  const onSubmit = (e) => {
    e.preventDefault();
    const values = {};
    props.forEach((prop) => (values[prop.id] = e.target[prop.id].value));
    onSave(values);
  };

  return (
    <div className="edit-component">
      <form onSubmit={onSubmit}>
        {props.map((prop) => {
          console.log(prop);
          return (
            <div className="edit-component-prop">
              <span>{prop.name}:</span>

              {inputTypes[prop.type] &&
                inputTypes[prop.type]({ ...prop, defaultValue: propValues[prop.id] })}
            </div>
          );
        })}

        <button className={`bu-button bu-is-link`}>
          <span className="button-text">{onSaveText}</span>
        </button>
      </form>
    </div>
  );
});
