import { Button, Label, LucideIcon } from '@fileverse/ui'
import { useState } from 'react'
import { usePortalContext } from '../providers/portal-provider'
import { usePortalViewerContext } from '../providers/portal-viewer-provider'
import { nanoid } from 'nanoid'
import { PortalSection } from '../types'

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
  const { updatePortal } = usePortalContext()
  const { portalMetadata } = usePortalViewerContext()
  const [isUpdating, setIsUpdating] = useState(false)
  const [name, setName] = useState(currentName)
  const [description, setDescription] = useState(currentDescription)
  const [sections, setSections] = useState<PortalSection[]>(
    portalMetadata?.data.sections || []
  )

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        name: '',
        orderNumber: prev.length + 1,
        id: nanoid(),
      },
    ])
  }

  const handleRemoveSection = (index: number) => {
    setSections((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((section, i) => ({
          ...section,
          orderNumber: i + 1,
        }))
    )
  }

  const handleSectionChange = (
    index: number,
    field: 'name' | 'orderNumber',
    value: string | number
  ) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    )
  }

  const handleSubmit = async () => {
    try {
      setIsUpdating(true)
      await updatePortal(name, description, sections)
      onClose()
    } catch (error) {
      console.error('Failed to update portal:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">Edit portal</h2>

          <div className="space-y-6">
            {/* Name and Description fields */}
            <div>
              <Label className="text-body-sm" required>
                Portal Name
              </Label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
              />
            </div>

            <div>
              <Label className="text-body-sm" required>
                Portal Description
              </Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
              />
            </div>

            {/* Sections */}
            <div>
              <Label className="text-body-sm mb-4">Portal Sections</Label>
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className="grid grid-cols-12 gap-4 items-start mb-4"
                >
                  <div className="col-span-7">
                    <input
                      placeholder="Section name"
                      value={section.name}
                      onChange={(e) =>
                        handleSectionChange(index, 'name', e.target.value)
                      }
                      className="bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={section.orderNumber}
                      onChange={(e) =>
                        handleSectionChange(
                          index,
                          'orderNumber',
                          parseInt(e.target.value)
                        )
                      }
                      className="bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      value={section.id}
                      disabled
                      className="bg-gray-50 w-full px-3 py-2 rounded-lg border border-gray-200"
                    />
                  </div>
                  {sections.length > 1 && (
                    <div className="col-span-1">
                      <button
                        onClick={() => handleRemoveSection(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <LucideIcon name="X" size="sm" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddSection}
                className="flex items-center gap-2 text-gray-900 hover:text-gray-700 py-2"
              >
                <LucideIcon name="Plus" size="sm" />
                Add one more section
              </button>
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
            disabled={isUpdating || !name || !description}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
