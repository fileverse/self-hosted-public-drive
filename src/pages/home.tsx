import { Footer } from '../components/footer'
import { PageHeading } from '../components/page-heading'
import { CreateOrLogin } from '../components/create-or-login'

import { HomePageFlow } from '../types'
import { CreateNewForm } from '../components/create-new-form'
import { usePortalContext } from '../providers/portal-provider'
import { DownloadKeys } from '../components/download-keys'
import { Login } from '../components/login'

const HEADING_MAP = {
  [HomePageFlow.CREATE_NEW]: 'Portal Creation',
  [HomePageFlow.LOGIN_TO_PORTAL]: 'Login to Portal',
  [HomePageFlow.DOWNLOAD_KEYS]: 'Please download your keys',
}

const DOWNLOAD_KEYS_DESCRIPTION =
  'Unlike big-tech platforms that can access your data, censor it, or arbitrarily revoke your account, Fileverse takes steps to offer you self-sovereignty. This static page is designed to make it easy for you to control your documents end-to-end without depending on centralized servers 💛'
const DEFAULT_DESCRIPTION =
  'Independently recover all documents tied to your account in case the main Fileveres portal app is down.'
const Home = () => {
  const { currentFlow, setCurrentFlow } = usePortalContext()

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
    : 'Fileverse Portal Walkaway'

  const onBackButtonClick = () => {
    setCurrentFlow(null)
  }

  const hasBackButton =
    currentFlow !== null && currentFlow !== HomePageFlow.DOWNLOAD_KEYS

  const description =
    currentFlow === HomePageFlow.DOWNLOAD_KEYS
      ? DOWNLOAD_KEYS_DESCRIPTION
      : DEFAULT_DESCRIPTION

  return (
    <main className="max-w-[768px] mx-auto py-6 flex flex-col h-full">
      <div className="flex flex-col gap-2 mb-8 mt-6">
        <PageHeading
          heading={heading}
          onBackClick={hasBackButton ? onBackButtonClick : undefined}
        />
        <p className="text-body-md color-text-secondary">{description}</p>
      </div>
      {getComponent()}
      <Footer />
    </main>
  )
}

export { Home }
