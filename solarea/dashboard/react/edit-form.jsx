const { Select } = await require('https://cdnjs.cloudflare.com/ajax/libs/antd/4.14.1/antd.min.js');
await require('https://cdnjs.cloudflare.com/ajax/libs/antd/4.17.0-alpha.3/antd.min.css');

const { Option } = Select;

const CustomSelect = ({ options, name, id, defaultValue }) => {
  const [value, setValue] = React.useState([]);
  return (
    <>
      <input
        name={id}
        style={{ visibility: 'hidden', position: 'absolute' }}
        value={'multipleSelect:' + value.join(',')}
      />
      <Select
        defaultValue={defaultValue}
        onChange={(v) => {
          setValue(v);
        }}
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder={`Choose ${name}`}
      >
        {options.map((option) => (
          <Option key={option.value}>{option.label}</Option>
        ))}
      </Select>
    </>
  );
};

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
        {options.map(({ value, label }) => (
          <option value={value}>{label}</option>
        ))}
      </select>
    </div>
  ),
  multipleSelect: ({ id, name, defaultValue, options }) => (
    <div style={{ display: 'block' }}>
      <CustomSelect name={name} id={id} options={options} defaultValue={defaultValue} />
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
    const values = {}; //multipleSelect
    props.forEach((prop) => {
      const source = e.target[prop.id];
      if (!source) return;

      let value = source.value;

      if (value.includes('multipleSelect:'))
        value = value.replace('multipleSelect:', '').split(',');

      values[prop.id] = value;
    });
    console.log(values);
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
