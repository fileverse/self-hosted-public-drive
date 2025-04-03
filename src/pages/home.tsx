import { Footer } from '../components/footer'
import { PageHeading } from '../components/page-heading'
import { CreateOrLogin } from '../components/create-or-login'

import { HomePageFlow } from '../types'
import { CreateNewForm } from '../components/create-new-form'
import { usePortalContext } from '../providers/portal-provider'
import { DownloadKeys } from '../components/download-keys'
import { Login } from '../components/login'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const HEADING_MAP = {
  [HomePageFlow.CREATE_NEW]: 'Public drive creation',
  [HomePageFlow.LOGIN_TO_PORTAL]: 'Log in to my public drive',
  [HomePageFlow.DOWNLOAD_KEYS]: 'Please download your keys',
}

const DOWNLOAD_KEYS_DESCRIPTION =
  'Unlike big-tech platforms that can access your data, censor it, or arbitrarily revoke your account, Fileverse takes steps to offer you self-sovereignty. This static page is designed to make it easy for you to control your documents end-to-end without depending on centralized servers 💛'

const DEFAULT_DESCRIPTION = `Self-host your public content on a minimal yet intuitive interface optimised for public viewing. Here you have the full-flexibility and control on how to manage your own infrastructure; from where you store your content, to how you host your static drive, passing by how you deploy your onchain smart account. The open-source software can be found <a style="color: blue" href="https://github.com/fileverse/self-hosted-public-drive" target="_blank" rel="noopener noreferrer">here</a>`

const CREATE_NEW_DESCRIPTION = `Here you have the full-flexibility and control on how to manage your own infrastructure; from where you store your content, to how you host your static drive, passing by how you deploy your onchain smart account.`

const LOGIN_DESCRIPTION = `Independently recover all documents tied to your account in case the main Fileveres portal app is down.`

const Home = () => {
  const { currentFlow, setCurrentFlow } = usePortalContext()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const accessCode = searchParams.get('CODE')
  const validCode = import.meta.env.VITE_ACCESS_CODE

  useEffect(() => {
    const portalData = localStorage.getItem('portalDetails')

    if (portalData) {
      try {
        const { portalAddress, pinataGateway } = JSON.parse(portalData)
        // Navigate using hash routing
        navigate(`/${portalAddress}?gateway=${pinataGateway}`)
      } catch (error) {
        console.error('Failed to parse portal data:', error)
      }
    }
  }, [navigate])

  if (accessCode !== validCode) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-2">Access Denied</h1>
          <p className="text-gray-600">Invalid or missing access code</p>
        </div>
      </div>
    )
  }

  const getComponent = () => {
    switch (currentFlow) {
      case HomePageFlow.CREATE_NEW:
        return <CreateNewForm />
      case HomePageFlow.LOGIN_TO_PORTAL:
        return <Login />
      case HomePageFlow.DOWNLOAD_KEYS:
        return <DownloadKeys />
      default:
        return <CreateOrLogin />
    }
  }
  const heading = currentFlow
    ? HEADING_MAP[currentFlow]
    : 'Self-Hosted Public Drive '

  const onBackButtonClick = () => {
    setCurrentFlow(null)
  }

  const hasBackButton =
    currentFlow !== null && currentFlow !== HomePageFlow.DOWNLOAD_KEYS

  const description =
    currentFlow === HomePageFlow.DOWNLOAD_KEYS
      ? DOWNLOAD_KEYS_DESCRIPTION
      : currentFlow === HomePageFlow.CREATE_NEW
        ? CREATE_NEW_DESCRIPTION
        : currentFlow === HomePageFlow.LOGIN_TO_PORTAL
          ? LOGIN_DESCRIPTION
          : DEFAULT_DESCRIPTION

  return (
    <main className="min-h-full px-4 sm:px-6">
      <div className="max-w-[768px] mx-auto py-4 sm:py-6 flex flex-col h-full">
        <div className="flex flex-col gap-2 mb-6 sm:mb-8 mt-4 sm:mt-6">
          <PageHeading
            heading={heading}
            onBackClick={hasBackButton ? onBackButtonClick : undefined}
          />
          <p
            dangerouslySetInnerHTML={{ __html: description }}
            className="text-[14px] sm:text-[16px] text-[#77818A]"
          />
        </div>

        <div className="flex-1">{getComponent()}</div>

        {currentFlow !== HomePageFlow.CREATE_NEW && <Footer />}
      </div>
    </main>
  )
}

export { Home }
