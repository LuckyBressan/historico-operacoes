import './App.css'
import ContratosProvider from './providers/contratos-provider'
import Routes from './routes'

function App() {


  return (
    <ContratosProvider>
      <Routes />
    </ContratosProvider>
  )
}

export default App
