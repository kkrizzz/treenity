add(({ success }) => {
  useCSS(
    'solarea-tx-badge.css',
    `
   .solarea-tx-badge {
     text-align: center;
     width: 100%;
     background: red;
     color: white;
   }
   .solarea-tx-badge-success {
     text-align: center;
     background: green;
     width: 100%;
     color: white;
   }
  `,
  );
  return (
    <div className={`solarea-tx-badge${success ? '-success' : ''}`}>
      {success ? 'Success' : 'Error'}
    </div>
  );
});
