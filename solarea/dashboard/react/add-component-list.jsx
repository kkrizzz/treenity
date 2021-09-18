const EditForm = render('dashboard', 'edit-form');

const availableComponentsIDs = [
  'example',
  'token-price',
  'watchlist',
  'balance',
  'portfolio-total-price',
  'portfolio-nft',
  'token-charts',
];

add(function AddComponentList({ onAdd }) {
  const [chosenComponent, setChosenComponent] = React.useState(null);
  const [availableComponents, setSvailableComponents] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      const list = [];
      for (const id of availableComponentsIDs) {
        try {
          const component = await require(`solarea://dashboard/${id}/components`);
          list.push({ ...component, id });
        } catch (e) {
          console.error(e);
        }
      }
      setSvailableComponents(list);
    })();
  }, []);

  useCSS(
    'add-component-list.css',
    css`
      .add-component-list {
        padding: 8px 16px;
        overflow-y: auto;
        min-height: 100%;
      }
      .add-component-list > * {
        margin-bottom: 8px;
        cursor: pointer;
      }
      .add-component-list > *:last-child {
        margin-bottom: 0;
      }
      .add-component-list > button {
        position: absolute;
        left: 8px;
        bottom: 8px;
      }
    `,
  );

  if (chosenComponent)
    return (
      <div className="add-component-list">
        <EditForm
          componentID={chosenComponent.id}
          propValues={{}}
          onSave={(props) =>
            onAdd &&
            onAdd({
              id: `component-${Date.now()}`,
              componentID: chosenComponent.id,
              componentName: chosenComponent.name,
              props: props,
            })
          }
          onSaveText={'Add'}
        />
        <button className="bu-button" onClick={() => setChosenComponent(null)}>
          <span className="button-text">Go back</span>
        </button>
      </div>
    );

  return (
    <div className="add-component-list">
      {availableComponents.map((component) => (
        <div className="bu-card" onClick={() => setChosenComponent(component)}>
          <header className="bu-card-header">
            <p className="bu-card-header-title">{component.name}</p>
          </header>
          <div className="bu-card-content">
            <div className="bu-content">{component.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
});
