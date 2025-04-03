import { Button } from '@fileverse/ui'
import { FileIcon } from '../assets/icons'
import { useUpload } from '../hooks/use-upload'
import { usePortalContext } from '../providers/portal-provider'
import { useNavigate } from 'react-router-dom'
import { LucideIcon } from '@fileverse/ui'

export const Login = () => {
  const { portalDetails } = usePortalContext()
  const navigate = useNavigate()
  const {
    uploadState,
    dragActive,
    handleChange,
    handleDrag,
    handleDrop,
    onButtonClick,
    inputRef,
    file,
    isOwner,
    handleRemoveFile,
  } = useUpload()

  const onLoginToPortal = () => {
    const gateway = portalDetails?.pinataGateway || ''
    if (portalDetails?.portalAddress) {
      navigate(
        `/${portalDetails.portalAddress}?gateway=${encodeURIComponent(gateway)}`
      )
    }
  }

  const getStatusDisplay = () => {
    switch (uploadState) {
      case 'uploading':
        return (
          <div className="w-20 sm:w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black animate-progress"></div>
          </div>
        )
      case 'uploaded':
        return (
          <div className="bg-[#DDFBDF] rounded px-2 py-1 text-[12px] sm:text-[14px] leading-5 font-normal text-[#177E23]">
            Uploaded
          </div>
        )
      case 'failed':
        return (
          <div className="bg-[#FFE5E5] rounded px-2 py-1 text-[12px] sm:text-[14px] leading-5 font-normal text-[#D92D20]">
            Failed to upload
          </div>
        )
      case 'incorrect':
        return (
          <div className="bg-[#FFE5E5] rounded px-2 py-1 text-[12px] sm:text-[14px] leading-5 font-normal text-[#D92D20]">
            Incorrect file format
          </div>
        )
      case 'invalid-source':
        return (
          <div className="bg-[#FFE5E5] rounded px-2 py-1 text-[12px] sm:text-[14px] leading-5 font-normal text-[#D92D20]">
            Wrong file source
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-[18px] sm:text-[24px] leading-7 sm:leading-8 font-medium pb-4">
        Upload your Backup Keys
      </h2>

      <div className="w-full bg-white rounded-xl shadow-sm">
        <div
          className={`border-2 border-dashed ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          } 
          rounded-xl p-8 sm:p-12 text-center transition-all duration-200`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".json"
            onChange={handleChange}
            className="hidden"
          />
          <p
            onClick={onButtonClick}
            className="text-gray-600 text-[14px] sm:text-[16px] leading-6"
          >
            Drag & Drop your JSON file in this area or
            <span className="text-[#5C0AFF] font-medium hover:underline cursor-pointer ml-2">
              Browse
            </span>
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-2">
          <div className="p-4 hover:bg-gray-50 transition-colors duration-200 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-gray-600 p-2 bg-gray-50 rounded-lg">
                  <FileIcon />
                </div>
                <div>
                  <div className="text-[14px] sm:text-[16px] font-medium text-gray-900">
                    {file.name}
                  </div>
                  <div className="text-[12px] sm:text-[14px] text-gray-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusDisplay()}
                <button
                  onClick={() => {
                    if (inputRef.current) inputRef.current.value = ''
                    handleRemoveFile()
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <LucideIcon name="X" size="sm" />
                </button>
              </div>
            </div>
          </div>
          <hr className="mb-6 border-gray-50" />

          <Button
            disabled={!isOwner}
            onClick={onLoginToPortal}
            className="w-full mt-5 p-4 sm:p-5 text-[16px]"
          >
            Log in to public drive
          </Button>
        </div>
      )}
    </div>
  )
}
