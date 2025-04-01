import { Button, LucideIcon } from '@fileverse/ui'
import { useRef, useState, useEffect } from 'react'
import { usePortalContext } from '../providers/portal-provider'
import {
  PortalViewerProvider,
  usePortalViewerContext,
} from '../providers/portal-viewer-provider'
import { FileList } from '../components/file-list'
import { UploadFileModal } from '../components/upload-file-modal'
import { FilePreview } from '../components/file-preview'
import { PortalFile } from '../types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EditPortalModal } from '../components/edit-portal-modal'
import { DescriptionModal } from '../components/description-modal'
import { DELETE_FILE_METADATA } from '../utils/constants'

const Portal = () => {
  // Add this helper function right after the component declaration
  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addFile, clearOwnerDetails } = usePortalContext()
  const { isOwner, updateFileList, portalMetadata, files } =
    usePortalViewerContext()
  const navigate = useNavigate()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileForPreview, setSelectedFileForPreview] =
    useState<PortalFile | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const fileId = searchParams.get('fileId')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDescriptionModal, setShowDescriptionModal] = useState(false)
  const [hasManuallyClosedPreview, setHasManuallyClosedPreview] =
    useState(false)

  // Handle initial file preview from URL
  useEffect(() => {
    if (fileId && files) {
      const fileToPreview = files.find((f) => f.fileId === Number(fileId))
      if (fileToPreview) {
        setSelectedFileForPreview(fileToPreview)
      }
    }
  }, [fileId, files])

  // Add this effect after other useEffect hooks
  useEffect(() => {
    // Change !fileId to fileId === null to properly handle 0
    if (files?.length > 0 && fileId === null && !hasManuallyClosedPreview) {
      const activeFiles = files
        .filter(
          (file) => file.metadataHash !== DELETE_FILE_METADATA.metadataIpfsHash
        )
        .sort((a, b) => a.fileId - b.fileId)

      const oldestFile = activeFiles[0]

      if (oldestFile) {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('fileId', oldestFile.fileId.toString())
        setSearchParams(newParams)
        setSelectedFileForPreview(oldestFile)
      }
    }
  }, [files, fileId, searchParams, setSearchParams, hasManuallyClosedPreview])

  const onFileSelect = (file: File) => {
    setSelectedFile(file)
    setShowUploadModal(true)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onFileSelect(file)
  }

  const handleUpload = async (
    notes: string,
    setUploading: (loading: boolean) => void
  ) => {
    if (!selectedFile) return
    try {
      setUploading(true)
      await addFile(selectedFile, updateFileList, notes)
      setShowUploadModal(false)
      setSelectedFile(null)
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogout = () => {
    clearOwnerDetails()
    navigate('/')
  }

  const handleFileSelect = (file: PortalFile) => {
    setSelectedFileForPreview(file)
    // Update URL with fileId
    const newParams = new URLSearchParams(searchParams)
    newParams.set('fileId', file.fileId.toString())
    setSearchParams(newParams)
  }

  const handleClosePreview = () => {
    setSelectedFileForPreview(null)
    setHasManuallyClosedPreview(true)
    // Remove fileId from URL
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('fileId')
    setSearchParams(newParams)
  }

  return (
    <div className="h-full flex p-2 md:p-6 lg:p-6">
      {/* Main Content - Add transition and adjust width based on preview */}
      <div
        className={`
        flex-1 
        flex 
        flex-col 
        min-h-full 
        min-w-0 
        rounded-xl
        ${selectedFileForPreview ? 'lg:mr-[700px]' : ''}
      `}
      >
        {/* Fixed Header Section */}
        <div className="sticky top-0 z-10">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] leading-8 font-medium text-gray-900">
                {portalMetadata?.data.name}
              </h1>
              {isOwner && (
                <button onClick={() => setShowEditModal(true)}>
                  <LucideIcon name="Pencil" size="sm" />
                </button>
              )}
            </div>

            {isOwner && (
              <Button variant="secondary" onClick={handleLogout}>
                <LucideIcon name="LogOut" size="sm" />
                <span>&nbsp; Log out</span>
              </Button>
            )}
          </div>

          {/* Description */}
          <div className="px-6 pb-4">
            <div className="text-[14px] leading-5 text-gray-600">
              {portalMetadata?.data.description && (
                <div className="flex gap-1">
                  <p>{truncateText(portalMetadata.data.description, 100)}</p>
                  {portalMetadata.data.description.length > 100 && (
                    <button
                      onClick={() => setShowDescriptionModal(true)}
                      className="font-medium shrink-0"
                      style={{ color: '#5C0AFF' }}
                    >
                      Show more
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upload Button Section */}
          {isOwner && (
            <div className="pl-6 pt-6 pb-6">
              <Button
                onClick={onButtonClick}
                className="flex flex-col gap-3 items-start bg-black text-white hover:bg-black/90 transition-colors rounded-xl px-6 py-4 w-[200px] h-auto"
              >
                <input
                  onChange={onFileChange}
                  type="file"
                  accept="image/*, audio/*, video/*, text/*"
                  ref={fileInputRef}
                  className="hidden"
                />
                <LucideIcon name="Upload" size="md" className="text-white" />
                <span className="text-[16px] font-normal text-white">
                  Upload files
                </span>
              </Button>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <FileList onFileSelect={handleFileSelect} />
        </div>
      </div>

      {/* Preview Panel */}
      {selectedFileForPreview && (
        <div className="fixed lg:static right-0 top-0 bottom-0 w-full lg:max-w-[700px] bg-white border-l border-gray-200 shadow-lg lg:shadow-xl">
          <FilePreview
            file={selectedFileForPreview}
            onClose={handleClosePreview}
          />
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedFile && (
        <UploadFileModal
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          onCancel={() => {
            setShowUploadModal(false)
            setSelectedFile(null)
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          }}
          onUpload={handleUpload}
        />
      )}

      {/* Add Edit Modal */}
      {showEditModal && (
        <EditPortalModal
          onClose={() => setShowEditModal(false)}
          currentName={portalMetadata?.data.name || ''}
          currentDescription={portalMetadata?.data.description || ''}
        />
      )}

      {/* Description Modal */}
      {showDescriptionModal && (
        <DescriptionModal
          onClose={() => setShowDescriptionModal(false)}
          title={portalMetadata?.data.name || ''}
          description={portalMetadata?.data.description || ''}
        />
      )}
    </div>
  )
}

export const PortalWithProvider = () => {
  return (
    <PortalViewerProvider>
      <Portal />
    </PortalViewerProvider>
  )
}
