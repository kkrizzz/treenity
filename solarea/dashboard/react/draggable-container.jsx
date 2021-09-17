const {
  Draggable,
} = await require('https://unpkg.com/react-beautiful-dnd@13.1.0/dist/react-beautiful-dnd.min.js');

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  // padding: 16,
  borderRadius: '.25rem',
  margin: `0 0 8px 0`,
  border: '2px solid',
  borderColor: isDragging ? 'rgba(0,255,202,0.15)' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

add(function DraggableContainer({ draggableId, index, title, children, draggable }) {
  return <Draggable draggableId={draggableId} index={index}>
    {(provided, snapshot) => (<div
        ref={provided.innerRef}
      ...{draggable?provided.draggableProps:{}}
      ...{draggable?provided.dragHandleProps:{}}

      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
      >
        {children}
      </div>)}
  </Draggable>;
});
