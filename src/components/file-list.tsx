import { LucideIcon } from '@fileverse/ui'
import { useState, useEffect } from 'react'
import { usePortalViewerContext } from '../providers/portal-viewer-provider'
import { SkeletonLoader } from './skeleton-loader'
import { PortalFile } from '../types'
import { getNameAndExtension, getRelativeTime } from '../utils/helpers'
import { DELETE_FILE_METADATA } from '../utils/constants'
import { DeleteConfirmationModal } from './delete-confirmation-modal'
import { usePortalContext } from '../providers/portal-provider'
import { RenameFileModal } from './rename-file-modal'

type FileListProps = {
  onFileSelect?: (file: PortalFile) => void
}

export const FileList = ({ onFileSelect }: FileListProps) => {
  const { isLoading, files } = usePortalViewerContext()

  if (isLoading) return <FileListLoader />

  // Filter out deleted files and sort by fileId in ascending order
  const activeFiles = files
    .filter(
      (file) => file.metadataHash !== DELETE_FILE_METADATA.metadataIpfsHash
    )
    .sort((a, b) => a.fileId - b.fileId) // Changed sorting order here

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
  const { name, createdAt, fileId } = props
  const { name: nameWithoutExtension, extension } = getNameAndExtension(name)
  const { isOwner, refreshFiles } = usePortalViewerContext()
  const { deleteFile, updateFileName } = usePortalContext()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)

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

  const handleRename = async (newName: string) => {
    try {
      setIsRenaming(true)
      await updateFileName(
        props.fileId,
        newName,
        props.metadataHash,
        props.contentHash
      )
      setShowRenameModal(false)
      refreshFiles?.()
    } catch (error) {
      console.error('Failed to rename file:', error)
    } finally {
      setIsRenaming(false)
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

        {isOwner && (
          <div className="relative" data-menu>
            <button
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-900 transition-all duration-200 p-1"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
            >
              <LucideIcon name="EllipsisVertical" size="md" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMenu(false)
                      setShowRenameModal(true)
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <LucideIcon name="Pencil" size="sm" className="mr-2" />
                    Rename
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

      {showRenameModal && (
        <RenameFileModal
          fileName={name}
          onClose={() => setShowRenameModal(false)}
          onRename={handleRename}
          isRenaming={isRenaming}
        />
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

        {/* Created time placeholder */}
        <SkeletonLoader className="w-24 h-4" />
      </div>
    )
  }
  return <div className="flex flex-col">{loaders}</div>
}
