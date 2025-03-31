import { LucideIcon } from '@fileverse/ui'
import { usePortalContext } from '../providers/portal-provider'
import { HomePageFlow } from '../types'

export const CreateOrLogin = () => {
  const { setCurrentFlow } = usePortalContext()

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <button
        onClick={() => setCurrentFlow(HomePageFlow.CREATE_NEW)}
        className="flex-1 p-6 sm:p-8 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <LucideIcon name="Plus" size="md" className="text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium">Create New Portal</h3>
          <p className="text-[14px] sm:text-[16px] text-gray-600 leading-6">
            Create a new portal to start sharing files securely
          </p>
        </div>
      </button>

      <button
        onClick={() => setCurrentFlow(HomePageFlow.LOGIN_TO_PORTAL)}
        className="flex-1 p-6 sm:p-8 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <LucideIcon name="LogIn" size="md" className="text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium">Login to Portal</h3>
          <p className="text-[14px] sm:text-[16px] text-gray-600 leading-6">
            Access your existing portal and files
          </p>
        </div>
      </button>
    </div>
  )
}
