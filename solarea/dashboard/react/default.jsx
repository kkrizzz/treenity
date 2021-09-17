await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Icon = render('dashboard', 'icon');
const ComponentList = render('dashboard', 'component-list');
const Modal = render('dashboard', 'modal');
const EditForm = render('dashboard', 'edit-component');

const comp = {
  id: 'aa',
  componentID: 'example',
  props: { content: 'Eugene' },
};
const comp2 = {
  id: 'asd',
  componentID: 'example',
  props: { content: 'Lilya' },
};

add(() => {
  const [components, setComponents] = React.useState([comp, comp2]);
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
      <div className="bu-container bu-is-max-desktop" style={{ minHeight: '100vh' }}>
        <ComponentList
          isEditable={editable}
          components={components}
          onChoose={(component) => setEditComponent(component)}
          onChange={(components) => setComponents(components)}
        />
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
            componentID={editComponent.componentID}
            propValues={editComponent.props}
            onChange={(newProps) => {
              editComponent.props = newProps;
              setComponents(components);
              setEditComponent(null);
            }}
          />
        )}
      </Modal>

      <Modal visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <div>hello</div>
      </Modal>
    </div>
  );
});
