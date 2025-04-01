import { Button, LucideIcon } from '@fileverse/ui'
import { useState } from 'react'
import { getNameAndExtension } from '../utils/helpers'

type RenameFileModalProps = {
  fileName: string
  onClose: () => void
  onRename: (newName: string) => Promise<void>
  isRenaming?: boolean
}

export const RenameFileModal = ({
  fileName,
  onClose,
  onRename,
  isRenaming = false,
}: RenameFileModalProps) => {
  const { name, extension } = getNameAndExtension(fileName)
  const [newName, setNewName] = useState(name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim() && newName !== name) {
      await onRename(`${newName}.${extension}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Rename File</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <LucideIcon name="X" size="md" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Name
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter file name"
                disabled={isRenaming}
              />
              <span className="text-gray-500">.{extension}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isRenaming}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newName.trim() || newName === name || isRenaming}
              isLoading={isRenaming}
            >
              Rename
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
