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
  isLoadingFiles: boolean
  files: PortalFile[]
  portalOwner: Hex | null
  isOwner: boolean
  updateFileList: (file: PortalFile) => void
  refreshFiles: () => Promise<void>
}

const PortalViewerContext = createContext<PortalViewerContextType>({
  portalMetadata: null,
  isLoading: false,
  isLoadingFiles: false,
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
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [files, setFiles] = useState<PortalFile[]>([])
  const [portalOwner, setPortalOwner] = useState<Hex | null>(null)
  const { agentAddress } = usePortalContext()

  // Get gateway once
  const gateway = searchParams.get('gateway')

  const refreshFiles = useCallback(async () => {
    if (!portalAddress) return
    try {
      setIsLoading(true)
      setIsLoadingFiles(true)
      setFiles([])

      const rawMetadata = await getPortalMetadata(
        portalAddress as Hex,
        gateway || undefined
      )

      // Construct the metadata object in the correct format
      const portalMetadata: IPortalMetadata = {
        data: {
          name: rawMetadata.name,
          description: rawMetadata.description,
          pinataGateway: gateway || rawMetadata.pinataGateway,
          sections: rawMetadata.sections || [],
        },
        pinataGateway: gateway || rawMetadata.pinataGateway,
      }

      const portalOwner = await getPortalOwner(portalAddress as Hex)
      const totalFileCount = await getPortalFileCount(portalAddress as Hex)

      setPortalMetadata(portalMetadata)
      setPortalOwner(portalOwner as Hex)
      setIsLoading(false)

      const filesMap = new Map<number, PortalFile>()

      const filePromises = Array.from(
        { length: totalFileCount },
        async (_, i) => {
          try {
            const { metadataHash, contentHash } = await getContractFile(
              i,
              portalAddress as Hex
            )

            const fileMetadata = await getIPFSAsset({
              ipfsHash: metadataHash,
              gatewayURL: portalMetadata.data.pinataGateway,
            })

            // Check if the file's section still exists in current sections
            const sectionExists = portalMetadata.data.sections.some(
              (section) => section.id === fileMetadata.sectionId
            )

            return {
              metadataHash,
              contentHash,
              fileId: i,
              fileType: fileMetadata.fileType,
              fileSize: fileMetadata.fileSize,
              name: fileMetadata.name,
              extension: fileMetadata.extension,
              createdAt: fileMetadata.createdAt,
              sectionId: sectionExists ? fileMetadata.sectionId : 'others', // Move to others if section doesn't exist
              notes: fileMetadata.notes,
            } as PortalFile
          } catch (err) {
            console.error(`Failed to fetch file ${i}:`, err)
            return null
          }
        }
      )

      for (const filePromise of filePromises) {
        const file = await filePromise
        if (file) {
          filesMap.set(file.fileId, file)
          setFiles(
            Array.from(filesMap.values()).sort((a, b) => a.fileId - b.fileId)
          )
        }
      }
      setIsLoadingFiles(false)
    } catch (err) {
      console.error(err)
      setIsLoading(false)
      setIsLoadingFiles(false)
    }
  }, [portalAddress, gateway])

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
        isLoadingFiles,
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
