import { LucideIcon } from '@fileverse/ui'
import { usePortalViewerContext } from '../providers/portal-viewer-provider'
import { SkeletonLoader } from './skeleton-loader'
import { PortalFile } from '../types'
import { getNameAndExtension, getRelativeTime } from '../utils/helpers'
import { DELETE_FILE_METADATA } from '../utils/constants'

type FileListProps = {
  onFileSelect?: (file: PortalFile) => void
}

export const FileList = ({ onFileSelect }: FileListProps) => {
  const { isLoading, files } = usePortalViewerContext()

  if (isLoading) return <FileListLoader />

  // Filter out deleted files
  const activeFiles = files.filter(
    (file) => file.metadataHash !== DELETE_FILE_METADATA.metadataIpfsHash
  )

  const fileList = activeFiles.map((file) => (
    <FileListItem
      key={file.fileId}
      {...file}
      onClick={() => onFileSelect?.(file)}
    />
  ))

  return <div className="w-full flex flex-col">{fileList}</div>
}

const FileListItem = ({
  onClick,
  ...props
}: PortalFile & { onClick?: () => void }) => {
  const { name, createdAt } = props
  const { name: nameWithoutExtension, extension } = getNameAndExtension(name)

  return (
    <div
      onClick={onClick}
      className="group px-6 py-3 flex items-center gap-3 cursor-pointer border-b hover:bg-[#F2F4F5] transition-all duration-200"
    >
      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
        <LucideIcon name="File" className="text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] leading-5 font-medium text-gray-900 truncate">
          {nameWithoutExtension}
        </p>
        <p className="text-[12px] leading-4 text-gray-500">
          {extension.toLowerCase()}
        </p>
      </div>
      <div className="text-[12px] leading-4 text-gray-500 whitespace-nowrap">
        Created {getRelativeTime(createdAt)}
      </div>
      <button
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <LucideIcon name="MoreVertical" size="md" />
      </button>
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
