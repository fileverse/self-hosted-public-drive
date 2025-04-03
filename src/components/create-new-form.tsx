import { Button, Label } from '@fileverse/ui'
import { useState } from 'react'
import { Input } from './input'
import { usePortalContext } from '../providers/portal-provider'
import { HomePageFlow, PortalSection } from '../types'
import { nanoid } from 'nanoid'
import { LucideIcon } from '@fileverse/ui'

export type CreatePortalInputs = {
  portalName: string
  portalDescription: string
  pinataJWT: string
  pinataGateway: string
  rpcUrl: string
  pimlicoApiKey: string
  sections: PortalSection[]
}

export const CreateNewForm = () => {
  const { createPortal, setCurrentFlow } = usePortalContext()
  const [isLoading, setIsLoading] = useState(false)
  const [inputs, setInputs] = useState<CreatePortalInputs>({
    portalName: '',
    portalDescription: '',
    pinataJWT: '',
    pinataGateway: '',
    rpcUrl: '',
    pimlicoApiKey: '',
    sections: [{ name: '', orderNumber: 1, id: nanoid() }],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (e.target.id === 'pinataGateway') {
      // Remove protocol (http:// or https://) and trailing slashes
      value = value.replace(/^https?:\/\//, '').replace(/\/+$/, '')
    }
    setInputs({ ...inputs, [e.target.id]: value })
  }

  const handleAddSection = () => {
    setInputs((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          name: '',
          orderNumber: prev.sections.length + 1,
          id: nanoid(),
        },
      ],
    }))
  }

  const handleRemoveSection = (index: number) => {
    setInputs((prev) => ({
      ...prev,
      sections: prev.sections
        .filter((_, i) => i !== index)
        .map((section, i) => ({
          ...section,
          orderNumber: i + 1,
        })),
    }))
  }

  const handleSectionChange = (
    index: number,
    field: 'name' | 'orderNumber',
    value: string | number
  ) => {
    setInputs((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }))
  }

  const onCreatePortal = async () => {
    if (Object.values(inputs).some((value) => !value)) {
      console.log('Please fill in all fields')
      return
    }
    try {
      setIsLoading(true)
      await createPortal(inputs)
      setCurrentFlow(HomePageFlow.DOWNLOAD_KEYS)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="text-heading-sm">General (for your visitors)</div>
        <Input
          label="Portal Name"
          value={inputs.portalName}
          onChange={handleChange}
          id="portalName"
          placeholder="Portal Name"
          required
        />

        <div className="flex items-start gap-4">
          <Label className="text-body-sm w-[170px]" required>
            Portal Description
          </Label>
          <textarea
            placeholder="Portal Description"
            value={inputs.portalDescription}
            onChange={(e) =>
              setInputs({ ...inputs, portalDescription: e.target.value })
            }
            id="portalDescription"
            rows={4}
            className="bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 text-[14px] placeholder:text-[14px] placeholder:text-gray-400"
          />
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-4">
        <div className="text-heading-sm">Pinata Keys</div>
        <Input
          label="PinataJWT"
          value={inputs.pinataJWT}
          onChange={handleChange}
          id="pinataJWT"
          placeholder="PinataJWT"
          required
        />
        <Input
          label="Gateway"
          value={inputs.pinataGateway}
          onChange={handleChange}
          id="pinataGateway"
          placeholder="Gateway"
          required
        />
      </div>
      <hr />
      <div className="flex flex-col gap-4">
        <div className="text-heading-sm">RPC Endpoint</div>
        <Input
          label="RPC URL"
          value={inputs.rpcUrl}
          onChange={handleChange}
          id="rpcUrl"
          placeholder="RPC URL"
          required
        />
      </div>
      <hr />
      <div className="flex flex-col gap-4">
        <div className="text-heading-sm">Pimlico</div>
        <Input
          label="API key"
          value={inputs.pimlicoApiKey}
          onChange={handleChange}
          id="pimlicoApiKey"
          placeholder="Pimlico API Key"
          required
        />
      </div>

      <hr />
      <div className="flex flex-col gap-4">
        <div className="text-heading-sm">Portal structure</div>

        {inputs.sections.map((section, index) => (
          <div key={section.id} className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-7">
              <Label className="text-body-sm" required>
                Section name
              </Label>
              <input
                placeholder="Section name"
                value={section.name}
                onChange={(e) =>
                  handleSectionChange(index, 'name', e.target.value)
                }
                className="bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 text-[14px] placeholder:text-[14px] placeholder:text-gray-400"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-body-sm" required>
                Order number
              </Label>
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
                className="bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 text-[14px]"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-body-sm">Section ID</Label>
              <input
                value={section.id}
                disabled
                className="bg-gray-50 w-full px-3 py-2 rounded-lg border border-gray-200 text-[14px] text-gray-500"
              />
            </div>
            {inputs.sections.length > 1 && (
              <div className="col-span-1 pt-8">
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
          className="flex items-center gap-2 text-gray-900 hover:text-gray-700 py-2 w-fit"
        >
          <LucideIcon name="Plus" size="sm" />
          Add one more section
        </button>
      </div>

      <div className="mb-12 w-full flex justify-end">
        <Button
          isLoading={isLoading}
          className="w-full"
          onClick={onCreatePortal}
          disabled={Object.values(inputs).some((value) => !value)}
        >
          Create Portal
        </Button>
      </div>
    </div>
  )
}
