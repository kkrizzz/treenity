add(() => {
  useCSS(
    'bulma-overrides.css',
    `
  .container {
    padding: 0;
  }
  .card {
    width: inherit !important;
  }
  .flex-between {
    flex:1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .text-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .solarea-tx-default_program-viewport {
  	max-height: 500px;
    border-bottom: 1px solid #b9b9b9;
    margin-bottom: 24px;
  }
  @media screen and (max-width: 480px) {
  	.column {
	  font-size: 12pt !important;
  	}
  }
  
  .m-b-8 {
    margin-bottom: 8px !important;
  }
  .m-b-16 {
    margin-bottom: 16px !important;
  }
  .m-t-8 {
    margin-top: 8px !important;
  }
  .m-t-16 {
    margin-top: 16px !important;
  }
  `,
  );
  return null;
});
