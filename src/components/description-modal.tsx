import { LucideIcon } from '@fileverse/ui'

type DescriptionModalProps = {
  onClose: () => void
  title: string
  description: string
}

export const DescriptionModal = ({
  onClose,
  title,
  description,
}: DescriptionModalProps) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/20">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <h3 className="text-[20px] font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <LucideIcon name="X" size="sm" className="text-gray-500" />
            </button>
          </div>
          <hr className="border-gray-200 mb-4" />

          {/* Content */}
          <div className="px-6 pb-6">
            <p className="text-[16px] leading-6 text-gray-600 whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
