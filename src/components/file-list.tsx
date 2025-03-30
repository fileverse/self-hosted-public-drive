import { LucideIcon } from '@fileverse/ui'
import { usePortalViewerContext } from '../providers/portal-viewer-provider'
import { SkeletonLoader } from './skeleton-loader'
import { PortalFile } from '../types'
import { getNameAndExtension, getRelativeTime } from '../utils/helpers'
import { useState } from 'react'

export const FileList = () => {
  const { isLoading, files } = usePortalViewerContext()

  if (isLoading) return <FileListLoader />

  const fileList = files.map((file) => (
    <FileListItem key={file.fileId} {...file} />
  ))

  return <div className="w-full flex flex-col">{fileList}</div>
}

const FileListItem = (props: PortalFile) => {
  const { name, createdAt, contentHash } = props
  const { name: nameWithoutExtension, extension } = getNameAndExtension(name)
  const { portalMetadata } = usePortalViewerContext()
  const [isDownloading, setIsDownloading] = useState(false)

  const onDownload = async () => {
    if (!portalMetadata || isDownloading) return
    try {
      const { pinataGateway } = portalMetadata
      const pinataDomain = pinataGateway.startsWith('https://')
        ? pinataGateway
        : `https://${pinataGateway}`

      setIsDownloading(true)
      const response = await fetch(`${pinataDomain}/ipfs/${contentHash}`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error(error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      onClick={onDownload}
      className="w-full p-3 flex border-b border-b-border-primary cursor-pointer hover:bg-background-[#F2F4F5]"
    >
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 bg-background-primary rounded-md flex items-center justify-center border border-border-primary">
          <LucideIcon name="File" />
        </div>
        <div className="flex flex-col ">
          <p className="text-heading-xsm">{nameWithoutExtension}</p>
          <p className="text-helper-text-sm color-text-secondary">
            {extension}
          </p>
        </div>
      </div>
      <div className="ml-auto text-right flex items-center gap-2">
        <p className="text-helper-text-sm color-text-secondary">
          Created At: {getRelativeTime(createdAt)}
        </p>
      </div>
    </div>
  )
}

const FileListLoader = () => {
  const loaders = []
  for (let i = 0; i < 10; i++) {
    loaders.push(<SkeletonLoader key={i} className="w-full h-10" />)
  }
  return <div className="flex flex-col gap-4">{loaders}</div>
}
