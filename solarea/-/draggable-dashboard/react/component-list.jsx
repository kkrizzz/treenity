const {
  DragDropContext,
  Droppable,
} = await require('https://unpkg.com/react-beautiful-dnd@13.1.0/dist/react-beautiful-dnd.min.js');
const DraggableContainer = render('draggable-dashboard', 'draggable-container');
const DashboardSection = render('dev', 'dashboard-section');
const Icon = render('dashboard', 'icon');

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

add(function ComponentList({
  components,
  onChange,
  isEditable,
  onChoose,
  onDelete,
  componentsBaseId,
}) {
  useCSS(
    'component-list',
    css`
      .settings-button {
        position: absolute;
        right: 28px;
        top: 4px;
        padding: 0;
      }
      .delete-button {
        position: absolute;
        right: 4px;
        top: 4px;
        padding: 0;
      }
      .component-list__item {
        width: 100%;
        position: relative;
      }

      .delete-button svg,
      .delete-button .bu-icon,
      .settings-button svg,
      .settings-button .bu-icon {
        width: 20px !important;
        height: 20px !important;
      }
    `,
  );
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    onChange(reorder(components, result.source.index, result.destination.index));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            data-rbd-droppable-id={provided.droppableProps['data-rbd-droppable-id']}
            data-rbd-droppable-context-id={provided.droppableProps['data-rbd-droppable-context-id']}
          >
            {components.map((item, index) => {
              console.log(item.componentID);
              const Component = render(
                componentsBaseId,
                `${item.componentID}-component`,
                'components',
              );

              return (
                <DraggableContainer
                  key={item.id}
                  draggableId={item.id}
                  draggable={isEditable}
                  index={index}
                >
                  <div className={'component-list__item'}>
                    <DashboardSection
                      title={item.componentName || item.componentID}
                      style={{ marginBottom: 0 }}
                    >
                      <Component {...item.props} />
                      {isEditable && (
                        <button
                          className="settings-button bu-card-header-icon"
                          title="Edit component"
                          aria-label="more options"
                          onClick={() => onChoose(item)}
                        >
                          <Icon type="gear" />
                        </button>
                      )}
                      {isEditable && (
                        <button
                          className="delete-button bu-card-header-icon"
                          title="Delete component"
                          aria-label="more options"
                          onClick={() => onChange(components.filter((c) => c.id !== item.id))}
                        >
                          <Icon type="close" />
                        </button>
                      )}
                    </DashboardSection>
                  </div>
                </DraggableContainer>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});
