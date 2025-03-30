import { Button, LucideIcon } from '@fileverse/ui'
import { useRef, useState } from 'react'
import { usePortalContext } from '../providers/portal-provider'
import {
  PortalViewerProvider,
  usePortalViewerContext,
} from '../providers/portal-viewer-provider'
import { PortalDetails } from '../components/portal-details'
import { FileList } from '../components/file-list'
const Portal = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addFile } = usePortalContext()
  const [isUploading, setIsUploading] = useState(false)
  const { isOwner, updateFileList } = usePortalViewerContext()

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setIsUploading(true)

      await addFile(file, updateFileList)
    } catch (error) {
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="p-6 flex flex-col h-full gap-8">
      <div className="flex flex-col gap-2">
        <PortalDetails />
      </div>

      {isOwner ? (
        <Button
          onClick={onButtonClick}
          disabled={isUploading}
          isLoading={isUploading}
          className="flex flex-col items-start gap-3 !border-black color-bg-default-inverse color-text-inverse !border-[1px] rounded-lg p-4 cursor-pointer w-[170px] h-max"
        >
          <input
            onChange={onFileChange}
            type="file"
            accept="image/*, audio/*, video/*, text/*"
            ref={fileInputRef}
            className="hidden"
          />
          <LucideIcon name="Plus" />
          <span className="text-heading-xsm">Upload File</span>
        </Button>
      ) : null}
      <FileList />
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
