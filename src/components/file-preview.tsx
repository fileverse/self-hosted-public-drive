import { useState, useEffect } from 'react'
import { PortalFile } from '../types'
import { usePortalViewerContext } from '../providers/portal-viewer-provider'
import { LucideIcon } from '@fileverse/ui'
import { usePortalContext } from '../providers/portal-provider'
import { DeleteConfirmationModal } from './delete-confirmation-modal'

type FilePreviewProps = {
  file: PortalFile
  onClose: () => void
}

export const FilePreview = ({ file, onClose }: FilePreviewProps) => {
  const { portalMetadata, refreshFiles } = usePortalViewerContext()
  const { deleteFile } = usePortalContext()
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isNotesExpanded, setIsNotesExpanded] = useState(true)
  const [fileMetadata, setFileMetadata] = useState<any>(null)
  const [isMetadataLoading, setIsMetadataLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setContent(null)
    setError(null)
    setFileMetadata(null)
    setIsMetadataLoading(true)

    const fetchMetadata = async () => {
      try {
        const gateway = portalMetadata?.pinataGateway.startsWith('https://')
          ? portalMetadata?.pinataGateway
          : `https://${portalMetadata?.pinataGateway}`

        const response = await fetch(`${gateway}/ipfs/${file.metadataHash}`)
        const metadata = await response.json()
        setFileMetadata(metadata)
      } catch (err) {
        console.error('Failed to fetch file metadata:', err)
      } finally {
        setIsMetadataLoading(false)
      }
    }

    fetchMetadata()
  }, [file, portalMetadata])

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    setContent(null)

    const fileUrl = getFileUrl()
    if (!fileUrl) {
      setError('Unable to get file URL')
      setIsLoading(false)
      return
    }

    if (file.fileType.startsWith('text/')) {
      fetch(fileUrl)
        .then((response) => response.text())
        .then((text) => {
          setContent(text)
          setIsLoading(false)
        })
        .catch(() => {
          setError('Failed to load text content')
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [file, portalMetadata])

  const getFileUrl = () => {
    if (!portalMetadata?.pinataGateway) return null
    const gateway = portalMetadata.pinataGateway.startsWith('https://')
      ? portalMetadata.pinataGateway
      : `https://${portalMetadata.pinataGateway}`
    return `${gateway}/ipfs/${file.contentHash}`
  }

  const renderPreview = () => {
    const fileUrl = getFileUrl()
    if (!fileUrl) return null

    if (file.fileType.startsWith('text/')) {
      return content ? (
        <div className="text-[14px] leading-6 text-gray-700">{content}</div>
      ) : null
    }

    if (file.fileType.startsWith('image/')) {
      return (
        <img
          src={fileUrl}
          alt={file.name}
          className="max-w-full h-auto"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError('Failed to load image')
            setIsLoading(false)
          }}
        />
      )
    }

    if (file.fileType.startsWith('video/')) {
      return (
        <video
          controls
          className="max-w-full"
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setError('Failed to load video')
            setIsLoading(false)
          }}
        >
          <source src={fileUrl} type={file.fileType} />
          Your browser does not support the video tag.
        </video>
      )
    }

    if (file.fileType.startsWith('audio/')) {
      return (
        <audio
          controls
          className="w-full"
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setError('Failed to load audio')
            setIsLoading(false)
          }}
        >
          <source src={fileUrl} type={file.fileType} />
          Your browser does not support the audio tag.
        </audio>
      )
    }

    return (
      <div className="text-gray-500">
        Preview not available for this file type
      </div>
    )
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteFile(file.fileId)
      setShowDeleteConfirmation(false)
      refreshFiles?.()
      onClose()
    } catch (error) {
      console.error('Failed to delete file:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async () => {
    const fileUrl = getFileUrl()
    if (!fileUrl) return

    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  return (
    <>
      <div className="h-full flex flex-col bg-white">
        {/* Header always visible */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600 uppercase">
              {file.fileType.split('/')[1]}
            </div>
            <div className="text-xs text-gray-500">
              • {(file.fileSize / 1024).toFixed(2)} KB
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="text-gray-500 hover:text-blue-600"
              title="Download file"
            >
              <LucideIcon name="Download" size="md" />
            </button>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="text-gray-500 hover:text-red-600"
              title="Delete file"
            >
              <LucideIcon name="Trash" size="md" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Show loader or content */}
        {isMetadataLoading || isLoading ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-b-gray-800" />
              <div className="text-sm text-gray-600">Loading...</div>
            </div>
          </div>
        ) : (
          <>
            {/* Content section */}
            <div className="flex-1 overflow-auto p-6">
              <h1 className="text-xl font-medium mb-4">
                {fileMetadata?.name || file.name}
              </h1>
              {error ? (
                <div className="flex items-center justify-center py-8 text-red-500">
                  {error}
                </div>
              ) : (
                renderPreview()
              )}
            </div>

            {/* Notes Section */}
            <div className="border-t">
              <button
                onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <span className="font-medium">Notes</span>
                <LucideIcon
                  name={isNotesExpanded ? 'ChevronUp' : 'ChevronDown'}
                  size="md"
                />
              </button>
              {isNotesExpanded && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  {fileMetadata?.notes || 'No notes available'}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          fileName={file.name}
          isDeleting={isDeleting}
          onCancel={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}
