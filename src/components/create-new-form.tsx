import { Button } from '@fileverse/ui'
import { useState } from 'react'
import { Input } from './input'
import { usePortalContext } from '../providers/portal-provider'
import { HomePageFlow } from '../types'

export type CreatePortalInputs = {
  portalName: string
  portalDescription: string
  pinataJWT: string
  pinataGateway: string
  rpcUrl: string
  pimlicoApiKey: string
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
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (e.target.id === 'pinataGateway') {
      // Remove protocol (http:// or https://) and trailing slashes
      value = value.replace(/^https?:\/\//, '').replace(/\/+$/, '')
    }
    setInputs({ ...inputs, [e.target.id]: value })
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
        <div className="text-heading-sm">General</div>
        <Input
          label="Portal Name"
          value={inputs.portalName}
          onChange={handleChange}
          id="portalName"
          required
        />
        <Input
          label="Portal Description"
          value={inputs.portalDescription}
          onChange={handleChange}
          id="portalDescription"
          required
        />
      </div>
      <hr />
      <div className="flex flex-col gap-4">
        <div className="text-heading-sm">Pinata Keys</div>
        <Input
          label="PinataJWT"
          value={inputs.pinataJWT}
          onChange={handleChange}
          id="pinataJWT"
          required
        />
        <Input
          label="Gateway"
          value={inputs.pinataGateway}
          onChange={handleChange}
          id="pinataGateway"
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
          required
        />
      </div>
      <hr />
      <div className="flex flex-col gap-4">
        <div className="text-heading-sm">Pimlico</div>
        <Input
          label="Api Key"
          value={inputs.pimlicoApiKey}
          onChange={handleChange}
          id="pimlicoApiKey"
          required
        />
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
