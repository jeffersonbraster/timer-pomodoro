import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { ToastContainer } from 'react-toastify'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <BrowserRouter>
        <Router />
        <ToastContainer autoClose={2500} />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
