import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
//@ts-ignore
import '@fileverse/ui/styles'
import './index.css'
import App from './App.tsx'
import { PortalProvider } from './providers/portal-provider.tsx'
//@ts-ignore
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <PortalProvider>
        <App />
      </PortalProvider>
    </HashRouter>
  </StrictMode>
)
