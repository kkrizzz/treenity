await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Icon = render('dashboard', 'icon');
const ComponentList = render('draggable-dashboard', 'component-list');
const Modal = render('dashboard', 'modal');
const EditForm = render('draggable-dashboard', 'edit-form');
const AddComponentList = render('draggable-dashboard', 'add-component-list');

add(({ availableComponentsIDs, componentsBaseId, dashboardName }) => {
  const [components, setComponents] = solarea.useLocalStorageState(
    `dashboard-${componentsBaseId}-${dashboardName}`,
    [],
  );
  const [editable, setEditable] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editComponent, setEditComponent] = React.useState(null);

  useCSS(
    'dashboard.css',
    css`
      .dashboard {
        position: relative;
        padding-top: 16px;
      }
      .tools {
        position: fixed;
        bottom: 8px;
        left: min(calc((100vw - 960px) / 2 + 968px), calc(100vw - 98px));
        display: flex;
        flex-direction: column;
      }
      .tools > * {
        margin-bottom: 4px;
        width: 90px;
      }
      .tools > *:last-child {
        margin-bottom: 0;
      }

      @media screen and (max-width: 1024px) {
        .tools {
          right: 8px;
          left: auto;
          width: 40px;
        }
        .tools > * {
          width: 40px;
        }
        .tools .button-text {
          display: none;
        }
        .tools span {
          margin: 0 !important;
        }
      }
    `,
  );

  return (
    <div className="dashboard">
      <div>
        <ComponentList
          componentsBaseId={componentsBaseId}
          isEditable={editable}
          components={components}
          onChoose={(component) => setEditComponent(component)}
          onChange={(components) => setComponents(components)}
        />
        {!components.length && (
          <div
            className="bu-notification bu-is-info bu-is-light"
            style={{ width: 'max-content', margin: '40vh auto' }}
          >
            There are still no components here, but you can add a new one by clicking the "Add"
            button.
          </div>
        )}
      </div>

      <div className="tools">
        <button className="bu-button" onClick={() => setIsModalVisible(true)}>
          <Icon type="add" />
          <span className="button-text">Add</span>
        </button>

        <button
          className={`bu-button ${editable ? 'bu-is-link' : ''}`}
          onClick={() => setEditable((editable) => !editable)}
        >
          <Icon type={editable ? 'save' : 'edit'} />
          <span className="button-text">{editable ? 'Save' : 'Edit'}</span>
        </button>
      </div>

      <Modal visible={!!editComponent} onClose={() => setEditComponent(null)}>
        {editComponent && (
          <EditForm
            componentsBaseId={componentsBaseId}
            componentID={editComponent.componentID}
            propValues={editComponent.props}
            onSave={(newProps) => {
              console.log(newProps);
              editComponent.props = newProps;
              setComponents(components);
              setEditComponent(null);
            }}
          />
        )}
      </Modal>

      <Modal visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        {isModalVisible && (
          <AddComponentList
            availableComponentsIDs={availableComponentsIDs}
            componentsBaseId={componentsBaseId}
            onAdd={(newComponent) => {
              setComponents((components) => [newComponent, ...components]);
              setIsModalVisible(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
});
