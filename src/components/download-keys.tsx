import { Button } from '@fileverse/ui'
import { usePortalContext } from '../providers/portal-provider'
import { downloadObjectAsJson } from '../utils/helpers'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const DownloadKeys = () => {
  const { portalDetails } = usePortalContext()
  const [toggleGoToPortal, setToggleGoToPortal] = useState(false)
  const navigate = useNavigate()

  const handleDownloadKeys = () => {
    downloadObjectAsJson(portalDetails, 'portal-keys')
    setToggleGoToPortal(true)
  }

  const handleGoToPortal = () => {
    navigate(
      `/${portalDetails.portalAddress}?gateway=${portalDetails.pinataGateway}`
    )
  }
  return (
    <div className="flex gap-6">
      <Button
        className="w-full"
        variant="secondary"
        onClick={handleDownloadKeys}
      >
        Download Keys
      </Button>
      <Button
        disabled={!toggleGoToPortal}
        onClick={handleGoToPortal}
        className="w-full"
      >
        Go to Portal
      </Button>
    </div>
  )
}
