add(() => {
  useCSS(
    'bulma-overrides.css',
    `
   html { 
    padding: 0;
    margin: 0;
    background: #1c1d31 !important;
   }
  .container {
    padding: 0;
  }
  .card {
    color: white;
    background: #282945;
    padding: 8px;
    box-shadow: none !important;
    width: inherit !important;
  }
  .card-header-title {
    color: white;
  }
  .card-header {
      color: white;
      box-shadow: none !important; 
  }
  .card:before {
    border-color: transparent transparent transparent #1c1d31;
    border-width: 1rem 0 0 1rem;
    bottom: 0;
    left: 0;
  }
  .card:after, .card:before {
    border-style: solid;
    content: "";
    height: 0;
    position: absolute;
    width: 0;
 }
.card:after {
    border-color: transparent #1c1d31 transparent transparent;
    border-width: 0 1rem 1rem 0;
    right: 0;
    top: 0;
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
    
  .p-t-16 {
    padding-top: 16px !important;
  }    
  .p-t-8 {
    padding-top: 8px !important;
  }    
  .p-b-16 {
    padding-bottom: 16px !important;
  }    
  .p-b-8 {
    padding-bottom: 8px !important;
  }
  `,
  );
  return null;
});
