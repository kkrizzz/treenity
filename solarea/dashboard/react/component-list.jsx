const {
  DragDropContext,
  Droppable,
} = await require('https://unpkg.com/react-beautiful-dnd@13.1.0/dist/react-beautiful-dnd.min.js');
const DraggableContainer = render('dashboard', 'draggable-container');
const ComponentCard = render('dashboard', 'component-card');

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

add(function ComponentList({ components, onChange, isEditable, onChoose }) {
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
              const Component = render('dashboard', `${item.componentID}-component`, 'components');

              return (
                <DraggableContainer
                  key={item.id}
                  draggableId={item.id}
                  draggable={isEditable}
                  index={index}
                >
                  <ComponentCard title={item.componentID} onClick={()=>onChoose(item)}>
                    <Component ...{item.props} />
                  </ComponentCard>
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
