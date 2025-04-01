import { Button, LucideIcon } from '@fileverse/ui'
import { useState } from 'react'
import { usePortalContext } from '../providers/portal-provider'
import { usePortalViewerContext } from '../providers/portal-viewer-provider'

type EditPortalModalProps = {
  onClose: () => void
  currentName: string
  currentDescription: string
}

export const EditPortalModal = ({
  onClose,
  currentName,
  currentDescription,
}: EditPortalModalProps) => {
  const [name, setName] = useState(currentName)
  const [description, setDescription] = useState(currentDescription)
  const [isLoading, setIsLoading] = useState(false)
  const { updatePortal } = usePortalContext()
  const { refreshFiles } = usePortalViewerContext()

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      await updatePortal(name, description)
      await refreshFiles()
      onClose()
    } catch (error) {
      console.error('Failed to update portal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/20">
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Portal</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <LucideIcon name="X" size="sm" className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portal Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter portal name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter portal description"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer - make it more visible */}
          <div className="border-t p-4 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && (
                <div className="animate-spin">
                  <LucideIcon name="Loader2" size="sm" />
                </div>
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
