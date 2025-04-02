import { Button } from '@fileverse/ui'
import { useState } from 'react'
import { usePortalViewerContext } from '../providers/portal-viewer-provider'

type UploadFileModalProps = {
  fileName: string
  fileSize: number
  onCancel: () => void
  onUpload: (
    notes: string,
    setUploading: (loading: boolean) => void,
    sectionId: string
  ) => void
}

export const UploadFileModal = ({
  fileName,
  fileSize,
  onCancel,
  onUpload,
}: UploadFileModalProps) => {
  const [notes, setNotes] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const { portalMetadata } = usePortalViewerContext()

  const sections = portalMetadata?.data.sections || []

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-4">Upload file</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">File name</p>
              <p className="text-[14px] font-medium">{fileName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">File size</p>
              <p className="text-[14px] font-medium">
                {(fileSize / 1024).toFixed(2)} KB
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Section
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 text-[14px]"
                required
              >
                <option value="">Select a section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 text-[14px]"
                placeholder="Add notes about this file..."
              />
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={() => onUpload(notes, setIsUploading, selectedSectionId)}
            isLoading={isUploading}
            disabled={isUploading || !selectedSectionId}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  )
}
