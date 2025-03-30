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
    if (portalDetails && portalDetails.portalAddress) {
      navigate('/' + portalDetails.portalAddress)
    }
  }

  const getStatusDisplay = () => {
    switch (uploadState) {
      case 'uploading':
        return (
          <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black animate-progress"></div>
          </div>
        )
      case 'uploaded':
        return (
          <div className="bg-[#DDFBDF] rounded-[4px]  text-[12px] leading-[16px] font-normal text-[#177E23] p-1">
            Uploaded
          </div>
        )
      case 'failed':
        return (
          <div className="bg-[#FFE5E5] rounded-[4px]  text-[12px] leading-[16px] font-normal text-[#D92D20] p-1">
            Failed to upload
          </div>
        )
      case 'incorrect':
        return (
          <div className="bg-[#FFE5E5] rounded-[4px]  text-[12px] leading-[16px] font-normal text-[#D92D20] p-1">
            Incorrect file format
          </div>
        )
      case 'invalid-source':
        return (
          <div className="bg-[#FFE5E5] rounded-[4px]  text-[12px] leading-[16px] font-normal text-[#D92D20] p-1">
            Wrong file source
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-heading-sm mb-3">Upload your Backup Keys</h2>
      <div className="max-w-[960px] bg-white rounded-xl mt-4">
        <div
          className={`border-[1px] border-dashed ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-[#E8EBEC]'
          } 
              rounded font-normal text-sm leading-5 text-[#A1AAB1] p-8 text-center mb-4`}
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
          <p onClick={onButtonClick} className="text-gray-500">
            Drag & Drop your dDocs JSON file in this area or
            <span className="text-[#5C0AFF] hover:underline cursor-pointer ml-2">
              Browse
            </span>
          </p>
        </div>
      </div>

      {file && (
        <>
          <hr />
          <div className="p-1 mt-4 mb-4 hover:bg-[#F2F4F5] transition-colors duration-200 rounded-[4px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-gray-600">
                  <FileIcon />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
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
            className="w-full mt-4"
          >
            Login to portal
          </Button>
        </>
      )}
    </div>
  )
}
