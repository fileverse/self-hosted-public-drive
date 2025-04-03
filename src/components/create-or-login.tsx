import { LucideIcon } from '@fileverse/ui'
import { usePortalContext } from '../providers/portal-provider'
import { HomePageFlow } from '../types'

export const CreateOrLogin = () => {
  const { setCurrentFlow } = usePortalContext()

  return (
    <div className="flex flex-col">
      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentFlow(HomePageFlow.LOGIN_TO_PORTAL)}
          className="bg-white rounded-lg p-6 border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <LucideIcon name="LogIn" size="md" className="text-gray-900" />
            <h2 className="text-base font-medium text-gray-900">
              Log in to my public drive
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Access your existing self-hosted public drive(s)
          </p>
        </button>

        <button
          onClick={() => setCurrentFlow(HomePageFlow.CREATE_NEW)}
          style={{ backgroundColor: '#000' }}
          className="rounded-lg p-6 text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <LucideIcon name="Plus" size="md" className="text-white" />
            <h2 className="text-base font-medium text-white">
              Create New Public Drive
            </h2>
          </div>
          <p className="text-sm text-white">
            Create your new self-hosted public drive with your infrastructure
          </p>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-2">
        Files uploaded on a self-hosted public drive are not encrypted. Files
        are discoverable on the decentralised storage system you might use to
        host your content.
      </p>
    </div>
  )
}
