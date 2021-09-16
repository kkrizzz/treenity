const Table = ({ columns = [], data = [], stripped = false, bordered = false }) => {
  useCSS(
    'table',
    css`
      .bu-table.bu-is-striped tbody tr:not(.bu-is-selected):nth-child(even) {
        background-color: transparent !important;
      }
      .bu-table.bu-is-striped tbody tr:not(.bu-is-selected):nth-child(odd) {
        background-color: var(--theme-subcard-bg-color) !important;
      }

      .bu-table td,
      .bu-table th {
        border-color: transparent !important;
        color: var(--theme-main-color) !important;

        font-weight: 600 !important;
        font-size: 14px !important;
        padding: 20px 0.75em;
      }

      .bu-table {
        color: var(--theme-main-color);
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        background-color: transparent !important;
        width: 100%;
      }
    `,
  );
  return (
    <table
      className={`bu-table ${bordered ? 'bu-is-bordered' : ''} ${stripped ? 'bu-is-striped' : ''}`}
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
