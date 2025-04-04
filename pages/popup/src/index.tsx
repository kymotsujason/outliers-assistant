import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@src/index.css';
import Popup from '@src/Popup';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Popup />
    </ThemeProvider>,
  );
}

init();
