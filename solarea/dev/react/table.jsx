const Table = ({
  columns = [],
  data = [],
  headless = false,
  rowStyle,
  className,
  children,
  rowKey,
  onRowClick,
}) => {
  if (children) return <table className={className}>{children}</table>;
  return (
    <table className={className}>
      {!headless && (
        <thead>
          <tr>
            {columns.map((column) => (
              <th style={{ textAlign: column.textAlign || 'left' }}>{column.title}</th>
            ))}
          </tr>
        </thead>
      )}

      <tbody>
        {data.map((item, index) => (
          <tr
            key={rowKey ? rowKey(item, index) : index}
            style={{
              cursor: onRowClick ? 'pointer' : 'default',
              ...(rowStyle ? rowStyle(item) : {}),
            }}
            onClick={onRowClick ? () => onRowClick(item) : undefined}
          >
            {columns.map((column, i) => {
              const content = column.render
                ? column.render(item[column.dataIndex], item, index, data)
                : item[column.dataIndex];

              return (
                <td key={i} style={{ textAlign: column.textAlign || 'left' }}>
                  {column.nonClickable ? (
                    <div onClick={(e) => e.stopPropagation()}>{content}</div>
                  ) : (
                    content
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const StyledTable = styled(Table).attrs(({ bordered, stripped }) => ({
  className: `${bordered ? 'bordered ' : ''}${stripped ? 'striped' : ''}`,
}))`
  table-layout: ${({ fixed }) => (fixed ? 'fixed' : 'auto')};
  border-radius: ${(props) => props.theme.borderRadius};
  overflow: hidden;
  color: ${(props) => props.theme.colors.cardBG};
  font-size: 16px;
  line-height: 20px;
  background-color: transparent !important;
  width: 100%;

  tbody {
    background-color: ${(props) => props.theme.colors.cardBG};
  }

  tbody tr:nth-child(even) {
    background-color: ${(props) => props.theme.colors.cardBG};
  }
  &.striped tbody tr:nth-child(odd) {
    background-color: ${(props) => props.theme.colors.subcardBG};
  }

  thead {
    background-color: ${(props) => props.theme.colors.cardBG};
  }
  td,
  th {
    border-color: transparent;
    color: ${(props) => props.theme.colors.main};

    font-size: 14px;
    padding: 20px 20px;
  }

  th {
    font-weight: 600;
  }

  &.bordered tr:not(:last-child) td,
  &.bordered tr:not(:last-child) th {
    border-bottom: ${(props) => props.theme.colors.cardBG} 1px solid;
  }
`;

add(StyledTable);
