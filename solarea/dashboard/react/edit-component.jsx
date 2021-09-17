add(function EditComponent({ componentID, propValues, onChange }) {
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
    props.forEach((prop) => (values[prop.name] = e.target[prop.name].value));
    onChange(values);
  };

  return (
    <div className="edit-component">
      <form onSubmit={onSubmit}>
        {props.map((prop) => (
          <div className="edit-component-prop">
            <span>{prop.name}:</span>
            <input
              key={prop.name}
              name={prop.name}
              defaultValue={propValues[prop.name]}
              className="bu-input"
              type="text"
              placeholder={`Input ${prop.name}`}
            />
          </div>
        ))}

        <button className={`bu-button bu-is-link`} onClick={() => console.log('hello')}>
          <span className="button-text">Save</span>
        </button>
      </form>
    </div>
  );
});
