const {
  Draggable,
} = await require('https://unpkg.com/react-beautiful-dnd@13.1.0/dist/react-beautiful-dnd.min.js');

const getItemStyle = (isDragging, draggableStyle, draggable) => ({
  userSelect: 'none',
  borderRadius: '12px',
  margin: `0`,
  padding: '16px',
  border: '2px solid',
  background: 'var(--theme-subcard-bg-color)',
  borderColor: isDragging
    ? 'rgba(72,95,199,0.5)'
    : draggable
    ? 'rgba(126,126,126,0.2)'
    : 'transparent',

  ...draggableStyle,
});

add(function DraggableContainer({ draggableId, index, title, children, draggable, isEditable }) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...(draggable ? provided.draggableProps : {})}
          {...(draggable ? provided.dragHandleProps : {})}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, draggable)}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
});
