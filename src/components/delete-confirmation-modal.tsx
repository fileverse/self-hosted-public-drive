import { Button } from '@fileverse/ui'

type DeleteConfirmationModalProps = {
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
  fileName: string
}

export const DeleteConfirmationModal = ({
  onConfirm,
  onCancel,
  isDeleting,
  fileName,
}: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-2">Delete file?</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{fileName}"?
          <br /> <br /> This action cannot be undone.
        </p>
        <br />

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            isLoading={isDeleting}
            className="!bg-red-600 hover:!bg-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
