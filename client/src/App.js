import { ThemeProvider } from 'styled-components';
import theme from './styles/theme'
import GlobalStyle from './styles/GlobalStyles'
import { Outlet } from 'react-router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <NavBar />
      <div className="main">
        <Outlet />
      </div>
      <Footer />
    </ThemeProvider>
  );
}

export default App;