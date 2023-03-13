import { ThemeProvider } from 'styled-components';
import theme from './styles/theme'
import GlobalStyle from './styles/GlobalStyles'
import { Outlet } from 'react-router';
import NavBar from './components/NavBar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <NavBar />
      <div className="main">
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;