import { usePortalViewerContext } from '../providers/portal-viewer-provider'
import { SkeletonLoader } from './skeleton-loader'

export const PortalDetails = () => {
  const { portalMetadata, isLoading } = usePortalViewerContext()

  if (isLoading)
    return (
      <>
        <SkeletonLoader className="w-[200px] h-[10px]" />
        <SkeletonLoader className="w-[500px] h-[10px]" />
      </>
    )

  return (
    <>
      <h1 className="text-heading-2xlg">{portalMetadata?.name}</h1>
      <p className="text-body-md color-text-secondary">
        {portalMetadata?.description}
      </p>
    </>
  )
}
