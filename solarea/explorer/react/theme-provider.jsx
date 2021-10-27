const { ThemeProvider } = solarea;

const generalProps = {
  borderRadius: '12px',
  fontSize: {
    xsmall: '14px',
    small: '16px',
    medium: '20px',
    large: '40px',
  },
};
const lightTheme = {
  ...generalProps,
  colors: {
    main: 'black',
    mainBG: '#eef3ff',
    cardBG: '#f8faff',
    subcardBG: '#ffffff',
    link: '#0b74ff',
    success: '#00c164',
    error: '#ff003d',
    content: '#788cbf',
  },
};
const darkTheme = {
  ...generalProps,
  colors: {
    main: 'white',
    mainBG: '#0c1937',
    cardBG: '#1b2845',
    subcardBG: '#273555',
    link: '#0b74ff',
    success: '#00c164',
    error: '#ff003d',
    content: '#788cbf',
  },
};
const CustomThemeProvider = ({ children }) => {
  const [isDarkTheme] = solarea.useLocalStorageState('dark_theme', true);

  return <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>{children}</ThemeProvider>;
};
add(CustomThemeProvider);
