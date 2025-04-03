import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { PortalWithProvider } from './pages/portal'

function App() {
  return (
    <>
      <div className="pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:portalAddress" element={<PortalWithProvider />} />
        </Routes>
      </div>
      <footer className="fixed bottom-0 w-full bg-[#F8F9FA] py-2 px-4">
        <p className="text-sm text-gray-500">Self-hosted public drive</p>
      </footer>
    </>
  )
}

export default App
