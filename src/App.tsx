import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { PortalWithProvider } from './pages/portal'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:portalAddress" element={<PortalWithProvider />} />
      </Routes>
    </>
  )
}

export default App
