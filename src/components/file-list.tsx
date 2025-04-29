import { LucideIcon } from '@fileverse/ui'
import { useState, useEffect } from 'react'
import { usePortalViewerContext } from '../providers/portal-viewer-provider'
import { SkeletonLoader } from './skeleton-loader'
import { PortalFile } from '../types'
import { getNameAndExtension } from '../utils/helpers'
import { DELETE_FILE_METADATA } from '../utils/constants'
import { DeleteConfirmationModal } from './delete-confirmation-modal'
import { usePortalContext } from '../providers/portal-provider'
import { EditFileModal } from './edit-file-modal'

type FileListProps = {
  onFileSelect?: (file: PortalFile) => void
}

export const FileList = ({ onFileSelect }: FileListProps) => {
  const { isLoadingFiles, files, portalMetadata } = usePortalViewerContext()

  const sections = portalMetadata?.data?.sections || []

  if (isLoadingFiles) {
    return <FileListLoader />
  }

  // Group files by section, with fallback for undefined sectionId
  const filesBySection = files.reduce(
    (acc, file) => {
      if (file.metadataHash === DELETE_FILE_METADATA.metadataIpfsHash)
        return acc

      const sectionId = file.sectionId || 'others' // Changed from 'unsorted' to 'others'

      if (!acc[sectionId]) {
        acc[sectionId] = []
      }
      acc[sectionId].push(file)
      return acc
    },
    {} as Record<string, PortalFile[]>
  )

  // Sort sections by order number
  const sortedSections = sections.sort((a, b) => a.orderNumber - b.orderNumber)

  return (
    <div className="w-full flex flex-col">
      {/* Show sorted sections first */}
      {sortedSections.map((section) => {
        const sectionFiles = filesBySection[section.id] || []
        if (sectionFiles.length === 0) return null

        return (
          <div key={section.id} className="flex flex-col">
            <div className="px-6 py-3 bg-gray-50 border-b">
              <h2 className="text-md font-medium text-gray-900">
                {section.name}
              </h2>
            </div>

            {sectionFiles
              .sort((a, b) => a.fileId - b.fileId)
              .map((file) => (
                <FileListItem
                  key={file.fileId}
                  {...file}
                  onClick={() => onFileSelect?.(file)}
                />
              ))}
          </div>
        )
      })}

      {/* Show others section if any */}
      {filesBySection['others'] && filesBySection['others'].length > 0 && (
        <div className="flex flex-col">
          <div className="px-6 py-3 bg-gray-50 border-b">
            <h2 className="text-md font-medium text-gray-900">Others</h2>
          </div>

          {filesBySection['others']
            .sort((a, b) => a.fileId - b.fileId)
            .map((file) => (
              <FileListItem
                key={file.fileId}
                {...file}
                onClick={() => onFileSelect?.(file)}
              />
            ))}
        </div>
      )}
    </div>
  )
}

const FileListItem = ({
  onClick,
  ...props
}: PortalFile & { onClick?: () => void }) => {
  const { name, fileId, fileType, extension } = props
  const { name: nameWithoutExtension } = getNameAndExtension(name)
  const { isOwner, refreshFiles } = usePortalViewerContext()
  const { deleteFile } = usePortalContext()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Function to determine the icon based on file type
  const getFileIcon = () => {
    // First check extension for specific file types
    const lowerExtension = extension.toLowerCase()

    // Document types
    if (['pdf'].includes(lowerExtension)) {
      return 'FileText'
    }

    // Code/text files
    if (
      ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json'].includes(lowerExtension)
    ) {
      return 'Code'
    }

    // Markdown files
    if (['md', 'markdown', 'txt'].includes(lowerExtension)) {
      return 'FileText'
    }

    // Check by file type category
    if (fileType.startsWith('image/')) {
      return 'Image'
    }

    if (fileType.startsWith('video/')) {
      return 'Video'
    }

    if (fileType.startsWith('audio/')) {
      return 'Music'
    }

    // Default icon for all other files
    return 'File'
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteFile(fileId)
      setShowDeleteConfirmation(false)
      refreshFiles?.()
    } catch (error) {
      console.error('Failed to delete file:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-menu]')) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <>
      <div
        onClick={onClick}
        className="group px-6 py-3 flex items-center gap-3 cursor-pointer border-b hover:bg-[#F2F4F5] transition-all duration-200"
      >
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
          <LucideIcon name={getFileIcon()} className="text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] leading-5 font-medium text-gray-900 truncate">
            {nameWithoutExtension}
          </p>
          <p className="text-[12px] leading-4 text-gray-500">
            {extension.toLowerCase()}
          </p>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <LucideIcon name="EllipsisVertical" size="sm" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    setShowEditModal(true)
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <LucideIcon name="Pencil" size="sm" className="mr-2" />
                  Edit file
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    setShowDeleteConfirmation(true)
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                >
                  <LucideIcon name="Trash2" size="sm" className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          fileName={name}
          isDeleting={isDeleting}
          onCancel={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDelete}
        />
      )}

      {showEditModal && (
        <EditFileModal file={props} onClose={() => setShowEditModal(false)} />
      )}
    </>
  )
}

const FileListLoader = () => {
  const loaders = []
  for (let i = 0; i < 10; i++) {
    loaders.push(
      <div key={i} className="px-6 py-3 flex items-center gap-3 border-b">
        {/* Icon placeholder */}
        <SkeletonLoader className="w-10 h-10 rounded" />

        {/* Name and extension placeholder */}
        <div className="flex-1 min-w-0">
          <SkeletonLoader className="w-3/4 h-5 mb-1" />
          <SkeletonLoader className="w-1/4 h-4" />
        </div>
      </div>
    )
  }
  return <div className="flex flex-col">{loaders}</div>
}
