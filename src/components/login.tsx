import { Button } from '@fileverse/ui'
import { FileIcon } from '../assets/icons'
import { useUpload } from '../hooks/use-upload'
import { usePortalContext } from '../providers/portal-provider'
import { useNavigate } from 'react-router-dom'
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
    <div className="px-4 sm:px-0 mb-6 sm:mb-8">
      <h2 className="text-[20px] sm:text-[24px] leading-7 sm:leading-8 font-medium mb-3">
        Upload your Backup Keys
      </h2>

      <div className="w-full bg-white rounded-lg sm:rounded-xl mt-4">
        <div
          className={`border-[1px] border-dashed ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-[#E8EBEC]'
          } 
          rounded-lg p-6 sm:p-8 text-center mb-4`}
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
            className="text-gray-500 text-[14px] sm:text-[16px] leading-6"
          >
            Drag & Drop your dDocs JSON file in this area or
            <span className="text-[#5C0AFF] hover:underline cursor-pointer ml-2">
              Browse
            </span>
          </p>
        </div>
      </div>

      {file && (
        <>
          <hr className="my-4 sm:my-6" />
          <div className="p-3 sm:p-4 hover:bg-[#F2F4F5] transition-colors duration-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <div className="text-gray-600">
                  <FileIcon />
                </div>
                <div>
                  <div className="text-[14px] sm:text-[16px] font-medium text-gray-900">
                    {file.name}
                  </div>
                  <div className="text-[12px] sm:text-[14px] text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusDisplay()}
              </div>
            </div>
          </div>
          <Button
            disabled={!isOwner}
            onClick={onLoginToPortal}
            className="w-full mt-4 sm:mt-6 p-3 sm:p-4"
          >
            Login to portal
          </Button>
        </>
      )}
    </div>
  )
}
