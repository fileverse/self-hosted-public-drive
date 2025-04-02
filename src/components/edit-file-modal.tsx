import { Button, Label } from '@fileverse/ui'
import { useState } from 'react'
import { usePortalContext } from '../providers/portal-provider'
import { usePortalViewerContext } from '../providers/portal-viewer-provider'
import { PortalFile } from '../types'

type EditFileModalProps = {
  file: PortalFile
  onClose: () => void
}

export const EditFileModal = ({ file, onClose }: EditFileModalProps) => {
  const { updateFileName } = usePortalContext()
  const { portalMetadata, refreshFiles } = usePortalViewerContext()
  const [isUpdating, setIsUpdating] = useState(false)
  const [fileName, setFileName] = useState(file.name)
  const [selectedSectionId, setSelectedSectionId] = useState(file.sectionId)
  const sections = portalMetadata?.data?.sections || []

  const handleSubmit = async () => {
    try {
      setIsUpdating(true)
      await updateFileName(
        file.fileId,
        fileName,
        file.metadataHash,
        file.contentHash,
        selectedSectionId
      )
      await refreshFiles?.()
      onClose()
    } catch (error) {
      console.error('Failed to update file:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">Edit file</h2>

          <div className="space-y-4">
            <div>
              <Label className="text-body-sm" required>
                File name
              </Label>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
              />
            </div>

            <div>
              <Label className="text-body-sm" required>
                Section
              </Label>
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
                <option value="others">Others</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isUpdating}
            disabled={isUpdating || !fileName || !selectedSectionId}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
