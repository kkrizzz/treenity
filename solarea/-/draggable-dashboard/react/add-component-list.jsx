const EditForm = render('draggable-dashboard', 'edit-form');

add(function AddComponentList({ onAdd, availableComponentsIDs, componentsBaseId }) {
  const [chosenComponent, setChosenComponent] = React.useState(null);
  const [availableComponents, setSvailableComponents] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      const list = [];
      for (const id of availableComponentsIDs) {
        try {
          const component = await require(`solarea://${componentsBaseId}/${id}/components`);
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
          componentsBaseId="velas-dextools"
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
      <div className="bu-py-2">Select component to add to dashboard</div>
      {availableComponents.map((component) => (
        <div className="bu-card" onClick={() => setChosenComponent(component)}>
          <div className="bu-is-size-5 bu-has-text-weight-bold">{component.name}</div>
          <div className="bu-is-size-6">{component.description}</div>
        </div>
      ))}
    </div>
  );
});
