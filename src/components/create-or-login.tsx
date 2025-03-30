import { LucideIcon } from '@fileverse/ui'
import { usePortalContext } from '../providers/portal-provider'
import { HomePageFlow } from '../types'

export const CreateOrLogin = () => {
  const { setCurrentFlow } = usePortalContext()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div
          onClick={() => setCurrentFlow(HomePageFlow.LOGIN_TO_PORTAL)}
          className="flex flex-col gap-3 !border-black color-bg-default !border-[1px] rounded-lg p-4 cursor-pointer w-[170px]"
        >
          <LucideIcon name="Upload" />
          <span className="text-heading-xsm">Login in to my portal</span>
        </div>
        <div
          onClick={() => setCurrentFlow(HomePageFlow.CREATE_NEW)}
          className="flex flex-col gap-3 !border-black color-bg-default-inverse color-text-inverse !border-[1px] rounded-lg p-4 cursor-pointer w-[170px]"
        >
          <LucideIcon name="Plus" />
          <span className="text-heading-xsm">Create new</span>
        </div>
      </div>
      <p className="color-text-secondary text-helper-text-sm">
        *Content on this portal is not encrypted and will be public available
      </p>
    </div>
  )
}
