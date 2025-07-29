import { BrowserRouter as Router } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext"
import { DataProvider } from "./context/DataContext"
import ErrorBoundary from "./components/ErrorBoundary"
import { ConversionRateProvider } from './context/ConversionRateContext';
import { WalletProvider } from "./context/WalletContext"




function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider >
          <ConversionRateProvider>
            <WalletProvider >
              <AppRoutes />
            </WalletProvider>
          </ConversionRateProvider>
        </DataProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
