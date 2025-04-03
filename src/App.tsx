import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { PortalWithProvider } from './pages/portal'
import { useState } from 'react'
import { usePortalContext } from './providers/portal-provider'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { portalDetails } = usePortalContext()

  return (
    <>
      <div className="pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:portalAddress" element={<PortalWithProvider />} />
        </Routes>
      </div>

      {portalDetails && (
        <>
          <footer className="fixed bottom-0 w-full bg-[#F8F9FA] py-2 px-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm  hover:text-gray-700 hover:underline"
              style={{ color: '#6C757D' }}
            >
              Self-hosted public drive
            </button>
          </footer>

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-[600px]">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-medium">Proof of publishing</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-700 font-medium">
                        Author address
                      </h3>
                      <a
                        href={`https://gnosisscan.io/address/${portalDetails.owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                      </a>
                    </div>
                    <p className="text-gray-600 break-all">
                      {portalDetails.owner}
                    </p>
                  </div>
                  {/* 
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-700 font-medium">
                        Content Hash (IPFS)
                      </h3>
                      <button className="text-gray-400">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-600 break-all">
                      iKNi2ARXj6xjTixFo2MeJOTsc38Z6S3-dth4bJiRw_Zm
                    </p>
                  </div> */}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-700 font-medium">
                        Onchain record
                      </h3>
                      <a
                        href={`https://gnosisscan.io/address/${portalDetails.portalAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                      </a>
                    </div>
                    <p className="text-gray-600 break-all">
                      {portalDetails.portalAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default App
