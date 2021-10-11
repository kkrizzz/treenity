const Table = ({ columns = [], data = [], headless = false, className }) => {
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
          <tr>
            {columns.map((column) => (
              <td style={{ textAlign: column.textAlign || 'left' }}>
                {column.render
                  ? column.render(item[column.dataIndex], item, index, data)
                  : item[column.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const StyledTable = styled(Table).attrs(({ bordered, stripped }) => ({
  className: `bu-table${bordered ? ' bu-is-bordered' : ''}${stripped ? ' bu-is-striped' : ''}`,
}))`
  table-layout: ${({ fixed }) => (fixed ? 'fixed' : 'auto')};
  border-radius: ${(props) => props.theme.borderRadius};
  overflow: hidden;
  color: ${(props) => props.theme.colors.cardBG};
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  background-color: transparent !important;
  width: 100%;

  tbody {
    background-color: ${(props) => props.theme.colors.cardBG};
  }

  thead {
    background-color: ${(props) => props.theme.colors.cardBG};
  }
  td,
  th {
    color: ${(props) => props.theme.colors.main} !important;

    font-weight: 600 !important;
    font-size: 14px !important;
    padding: 20px 20px;
  }
`;

add(StyledTable);
