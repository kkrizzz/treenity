const Table = ({ columns = [], data = [], stripped = false, bordered = false }) => {
  return (
    <table
      className={`bu-table ${bordered ? 'bu-is-bordered' : ''} ${stripped ? 'bu-is-striped' : ''}`}
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
              <th style={{ textAlign: column.textAlign || 'left' }}>
                {column.render
                  ? column.render(item[column.dataIndex], item)
                  : item[column.dataIndex]}
              </th>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

add(Table);
