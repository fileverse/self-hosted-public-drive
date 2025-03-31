import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  getContractFile,
  getPortalFileCount,
  getPortalMetadata,
  getPortalOwner,
} from '../utils/portal-utils'
import { Hex } from 'viem'
import { IPortalMetadata, PortalFile } from '../types'
import { getIPFSAsset } from '../utils/ipfs-utils'
import { usePortalContext } from './portal-provider'

type PortalViewerContextType = {
  portalMetadata: IPortalMetadata | null
  isLoading: boolean
  files: PortalFile[]
  portalOwner: Hex | null
  isOwner: boolean
  updateFileList: (file: PortalFile) => void
  refreshFiles: () => Promise<void>
}

const PortalViewerContext = createContext<PortalViewerContextType>({
  portalMetadata: null,
  isLoading: false,
  files: [],
  portalOwner: null,
  isOwner: false,
  updateFileList: () => {},
  refreshFiles: async () => {},
})

export const usePortalViewerContext = () => {
  return useContext(PortalViewerContext)
}

export const PortalViewerProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { portalAddress } = useParams()
  const [searchParams] = useSearchParams()
  const [portalMetadata, setPortalMetadata] = useState<IPortalMetadata | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<PortalFile[]>([])
  const [portalOwner, setPortalOwner] = useState<Hex | null>(null)
  const { agentAddress } = usePortalContext()

  // Get gateway once
  const gateway = searchParams.get('gateway')

  const refreshFiles = useCallback(async () => {
    if (!portalAddress) return
    try {
      setIsLoading(true)
      const portalMetadata = (await getPortalMetadata(
        portalAddress as Hex,
        gateway || undefined
      )) as unknown as IPortalMetadata

      // Override gateway URL from query params if present
      if (gateway) {
        portalMetadata.pinataGateway = gateway
      }

      const portalOwner = await getPortalOwner(portalAddress as Hex)
      const totalFileCount = await getPortalFileCount(portalAddress as Hex)
      const newFiles = []
      for (let i = 0; i < totalFileCount; i++) {
        const { metadataHash, contentHash } = await getContractFile(
          i,
          portalAddress as Hex
        )
        const fileMetadata = (
          await getIPFSAsset({
            ipfsHash: metadataHash,
            gatewayURL: portalMetadata.pinataGateway,
          })
        ).data

        newFiles.push({
          metadataHash,
          contentHash,
          fileId: i,
          fileType: fileMetadata.fileType,
          fileSize: fileMetadata.fileSize,
          name: fileMetadata.name,
          extension: fileMetadata.extension,
          createdAt: fileMetadata.createdAt,
        } as PortalFile)
      }

      setFiles(newFiles.sort((a, b) => b.createdAt - a.createdAt))
      setPortalMetadata(portalMetadata)
      setPortalOwner(portalOwner as Hex)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [portalAddress, gateway]) // Only depend on portalAddress and gateway

  useEffect(() => {
    refreshFiles()
  }, [refreshFiles])

  const updateFileList = (file: PortalFile) => {
    setFiles((prevFiles) => [file, ...prevFiles])
  }

  return (
    <PortalViewerContext.Provider
      value={{
        portalMetadata,
        isLoading,
        files,
        portalOwner,
        isOwner: Boolean(agentAddress && agentAddress === portalOwner),
        updateFileList,
        refreshFiles,
      }}
    >
      {children}
    </PortalViewerContext.Provider>
  )
}
