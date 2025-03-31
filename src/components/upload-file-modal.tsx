import { Button } from '@fileverse/ui'
import { useState } from 'react'

type UploadFileModalProps = {
  fileName: string
  fileSize: number
  onCancel: () => void
  onUpload: (notes: string, setUploading: (loading: boolean) => void) => void
}

export const UploadFileModal = ({
  fileName,
  fileSize,
  onCancel,
  onUpload,
}: UploadFileModalProps) => {
  const [notes, setNotes] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] leading-8 font-medium">Upload file</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-[#2563EB] text-white rounded flex items-center justify-center">
              <span className="text-sm font-medium">DOC</span>
            </div>
            <div>
              <p className="text-[14px] leading-5 font-medium text-gray-900">
                {fileName}
              </p>
              <p className="text-[12px] leading-4 text-gray-500">
                {(fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={onCancel}
              className="ml-auto text-gray-500 hover:text-gray-700"
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

        <div className="mb-6">
          <label className="block mb-2">
            <span className="text-[14px] leading-5 font-medium">Notes</span>
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <textarea
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg text-[14px] leading-5 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type file description or other notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isUploading}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isUploading}
            className="px-4 py-2 text-[14px] leading-5"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onUpload(notes, setIsUploading)}
            disabled={!notes.trim() || isUploading}
            isLoading={isUploading}
            className="px-4 py-2 text-[14px] leading-5"
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  )
}
