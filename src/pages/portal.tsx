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

const Portal = () => {
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

  // Handle initial file preview from URL
  useEffect(() => {
    if (fileId && files) {
      const fileToPreview = files.find((f) => f.fileId === Number(fileId))
      if (fileToPreview) {
        setSelectedFileForPreview(fileToPreview)
      }
    }
  }, [fileId, files])

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
    // Remove fileId from URL
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('fileId')
    setSearchParams(newParams)
  }

  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-full bg-white min-w-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b flex items-start justify-between">
          <div>
            <h1 className="text-[24px] leading-8 font-medium text-gray-900 mb-1">
              {portalMetadata?.data.name}
            </h1>
            <p className="text-[14px] leading-5 text-gray-600">
              {portalMetadata?.data.description}
            </p>
          </div>

          {isOwner && (
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 !border-gray-200"
            >
              <LucideIcon name="LogOut" size="md" />
              <span>Logout</span>
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isOwner && (
            <div className="px-6 pt-6">
              <Button
                onClick={onButtonClick}
                className="flex items-center justify-center border border-black hover:bg-gray-50 transition-colors rounded-lg p-6 w-[160px] h-[40px] gap-3"
              >
                <input
                  onChange={onFileChange}
                  type="file"
                  accept="image/*, audio/*, video/*, text/*"
                  ref={fileInputRef}
                  className="hidden"
                />
                <LucideIcon name="Plus" size={'md'} />
                <span className="text-[14px] font-medium text-white">
                  Upload File
                </span>
              </Button>
            </div>
          )}

          <div className="mt-6">
            <FileList onFileSelect={handleFileSelect} />
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {selectedFileForPreview && (
        <div className="fixed lg:static right-0 top-0 bottom-0 w-full lg:max-w-[600px] bg-white border-l border-gray-200 shadow-lg lg:shadow-none z-50">
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
