const lightThemeCss = `
   html { 
    padding: 0;
    margin: 0;
    background: #white !important;
   }
.bu-tabs a { 
    font-weight: 900;
    color: white;
    padding: 0.5em 0;
    margin-right: 2em
  }
  .bu-tabs a:hover {
    border-bottom-color: #755cfd !important;
    color: #755cfd !important;
  }
  .bu-tabs li.bu-is-active a {
    border-bottom-color: #00d1b2 !important;
    color: #00d1b2 !important;
  }
  .bu-card {
    padding: 8px;
    width: inherit !important;
  }
  .bu-card-header {
      color: white;
      box-shadow: none !important; 
  }
`;

const darkThemeCss = `
html { 
 padding: 0;
 margin: 0;
 background: #1c1d31 !important;
}
.bu-tabs a { 
    font-weight: 900;
    color: black;
    padding: 0.5em 0;
    margin-right: 2em
  }
  .bu-tabs a:hover {
    border-bottom-color: #755cfd !important;
    color: #755cfd !important;
  }
  .bu-tabs li.bu-is-active a {
    border-bottom-color: #00d1b2 !important;
    color: #00d1b2 !important;
  }
  .bu-card {
    color: white;
    background: #282945;
    padding: 8px;
    box-shadow: none !important;
    width: inherit !important;
  }
  .bu-card-header-title {
    color: white;
  }
  .bu-card-header {
      color: white;
      box-shadow: none !important; 
  }
  .bu-card:before {
    border-color: transparent transparent transparent #1c1d31;
    border-width: 1rem 0 0 1rem;
    bottom: 0;
    left: 0;
  }
  .bu-card:after, .bu-card:before {
    border-style: solid;
    content: "";
    height: 0;
    position: absolute;
    width: 0;
 }
.bu-card:after {
    border-color: transparent #1c1d31 transparent transparent;
    border-width: 0 1rem 1rem 0;
    right: 0;
    top: 0;
}`;

add(() => {
  const [isDarkTheme, setIsDarkTheme] = solarea.useLocalStorageState('dark_theme', false);
  useCSS(
    'bulma-overrides.css',
    `
  .container {
    padding: 0;
  }
  
  .flex-between {
    flex:1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  ${isDarkTheme ? darkThemeCss : lightThemeCss}
  
  .overflow-auto {
    overflow: auto;
    white-space: nowrap;
  }
  
  .overflow-hidden {
    overflow: hidden;
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
  .m-r-8 {
    margin-right: 8px !important;
  }  
  .m-r-16 {
    margin-right: 16px !important;
  }  
  .m-l-8 {
    margin-left: 8px !important;
  }  
  .m-l-16 {
    margin-left: 16px !important;
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
