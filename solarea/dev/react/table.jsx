const Table = ({ columns = [], data = [], stripped = false, bordered = false }) => {
  useCSS(
    'table',
    css`
      .bu-table.bu-is-striped tbody tr:not(.bu-is-selected):nth-child(even) {
        background-color: rgba(178, 178, 178, 0.15) !important;
      }

      .bu-table td,
      .bu-table th {
        border-color: rgba(143, 143, 143, 0.3) !important;
      }

      .table {
        color: var(--theme-main-color);
        background-color: transparent !important;
      }

      .table th {
        color: var(--theme-main-color) !important;
      }
    `,
  );
  return (
    <table
      className={`bu-table table ${bordered ? 'bu-is-bordered' : ''} ${
        stripped ? 'bu-is-striped' : ''
      }`}
      style={{ width: '100%' }}
    >
      <thead>
        <tr>
          {columns.map((column) => (
            <th style={{ textAlign: column.textAlign || 'left' }}>{column.title}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr>
            {columns.map((column) => (
              <td style={{ textAlign: column.textAlign || 'left' }}>
                {column.render
                  ? column.render(item[column.dataIndex], item)
                  : item[column.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

add(Table);
