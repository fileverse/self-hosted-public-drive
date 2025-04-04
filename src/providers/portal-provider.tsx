import { createContext, useContext, useState, useEffect } from 'react'
import { CreatePortalInputs } from '../components/create-new-form'
import { PinataSDK } from 'pinata'
import { generatePrivateKey } from 'viem/accounts'
import { AgentClient } from '../utils/smart-account-agent'
import { FILE_TRX_TIMEOUT, mintPortal } from '../utils/portal-utils'
import {
  createPublicClient,
  encodeFunctionData,
  Hex,
  http,
  parseEventLogs,
} from 'viem'
import { gnosis } from 'viem/chains'
import { HomePageFlow, PortalFile, PortalSection } from '../types'
import { getFileExtension } from '../utils/helpers'
import { portalAbi } from '../data/portal-abi'
import { DELETE_FILE_METADATA } from '../utils/constants'

type PortalContextType = {
  createPortal: (values: CreatePortalInputs) => Promise<void>
  currentFlow: HomePageFlow | null
  portalDetails: any
  setCurrentFlow: (flow: HomePageFlow | null) => void
  setOwnerDetails: (details: any) => Promise<void>
  addFile: (
    file: File,
    updateFileList: (file: PortalFile) => void,
    notes?: string,
    sectionId?: string
  ) => Promise<void>
  agentAddress: Hex | null
  deleteFile: (fileId: number) => Promise<void>
  clearOwnerDetails: () => void
  updatePortal: (
    name: string,
    description: string,
    sections: PortalSection[]
  ) => Promise<void>
  updateFileName: (
    fileId: number,
    newName: string,
    currentMetadataHash: string,
    currentContentHash: string,
    newSectionId: string
  ) => Promise<void>
}

const PortalContext = createContext<PortalContextType>({
  createPortal: async () => {},
  currentFlow: null,
  portalDetails: null,
  setCurrentFlow: () => {},
  setOwnerDetails: async () => {},
  addFile: async () => {},
  agentAddress: null,
  deleteFile: async () => {},
  clearOwnerDetails: () => {},
  updatePortal: async () => {},
  updateFileName: async () => {},
})

export const usePortalContext = () => {
  return useContext(PortalContext)
}

export const PortalProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentFlow, setCurrentFlow] = useState<HomePageFlow | null>(null)
  const [portalDetails, setPortalDetails] = useState<any>(null)
  const [agentInstance, setAgentInstance] = useState<AgentClient | null>(null)
  const [pinataSDK, setPinataSDK] = useState<PinataSDK | null>(null)
  const [agentAddress, setAgentAddress] = useState<Hex | null>(null)

  // Load saved portal details on mount
  useEffect(() => {
    const savedPortalDetails = localStorage.getItem('portalDetails')
    if (savedPortalDetails) {
      const details = JSON.parse(savedPortalDetails)
      setOwnerDetails(details)
    }
  }, [])

  const createPortal = async (values: CreatePortalInputs) => {
    const pinataSDK = new PinataSDK({
      pinataJwt: values.pinataJWT,
      pinataGateway: values.pinataGateway,
    })

    const portalMetadata = {
      name: values.portalName,
      description: values.portalDescription,
      pinataGateway: values.pinataGateway,
      sections: values.sections.sort((a, b) => a.orderNumber - b.orderNumber),
    }

    const { cid } = await pinataSDK.upload.public.json(portalMetadata, {
      metadata: {
        name: `${values.portalName}.json`,
      },
    })

    const privateKey = generatePrivateKey()
    const publicClient = createPublicClient({
      transport: http(values.rpcUrl),
      chain: gnosis,
    })
    const agentInstance = new AgentClient()
    await agentInstance.initializeAgentClient(
      privateKey,
      publicClient,
      values.pimlicoApiKey
    )

    const portalDetails = await mintPortal(cid, agentInstance)
    setAgentInstance(agentInstance)
    setPinataSDK(pinataSDK)
    setAgentAddress(agentInstance.getAgentAddress())
    setPortalDetails({
      ...portalDetails,
      privateKey,
      name: values.portalName,
      description: values.portalDescription,
      pinataGateway: values.pinataGateway,
      rpcUrl: values.rpcUrl,
      pimlicoApiKey: values.pimlicoApiKey,
      pinataJWT: values.pinataJWT,
    })
  }

  const setOwnerDetails = async (portalDetails: any) => {
    const publicClient = createPublicClient({
      transport: http(portalDetails.rpcUrl),
      chain: gnosis,
    })
    const agentInstance = new AgentClient()
    await agentInstance.initializeAgentClient(
      portalDetails.privateKey,
      publicClient,
      portalDetails.pimlicoApiKey
    )

    const pinataSDK = new PinataSDK({
      pinataJwt: portalDetails.pinataJWT,
      pinataGateway: portalDetails.pinataGateway,
    })

    setAgentInstance(agentInstance)
    setPinataSDK(pinataSDK)
    setPortalDetails({
      ...portalDetails,
    })
    setAgentAddress(agentInstance.getAgentAddress())

    // Save to localStorage
    localStorage.setItem('portalDetails', JSON.stringify(portalDetails))
  }

  // Clear storage on logout or when needed
  const clearOwnerDetails = () => {
    localStorage.removeItem('portalDetails')
    setPortalDetails(null)
    setAgentInstance(null)
    setPinataSDK(null)
    setAgentAddress(null)
  }

  const addFile = async (
    file: File,
    updateFileList: (file: PortalFile) => void,
    notes?: string,
    sectionId?: string
  ) => {
    if (!pinataSDK || !portalDetails || !agentInstance)
      throw new Error('Not initialized')

    if (!sectionId) throw new Error('Section ID is required')

    // Handle markdown file type
    const fileType = file.name.endsWith('.md') ? 'text/markdown' : file.type

    const fileMetadata = {
      name: file.name,
      fileSize: file.size,
      fileType: fileType, // Use our adjusted fileType
      extension: getFileExtension(file.name),
      createdAt: Date.now(),
      notes,
      sectionId,
      fileId: 0,
      contentHash: '',
      metadataHash: '',
    } as PortalFile

    const { cid: metadataHash } = await pinataSDK.upload.public.json(
      fileMetadata,
      {
        metadata: {
          name: `${file.name}_metadata.json`,
        },
      }
    )

    const { cid: contentHash } = await pinataSDK.upload.public.file(file)

    const callData = encodeFunctionData({
      abi: portalAbi,
      functionName: 'addFile',
      args: [metadataHash, contentHash, '', 0, 0],
    })

    const { success, logs } = await agentInstance.executeUserOperationRequest(
      {
        data: callData,
        contractAddress: portalDetails.portalAddress,
      },
      FILE_TRX_TIMEOUT
    )

    if (!success) throw new Error('Failed to upload file')

    const parsedLog = parseEventLogs({
      abi: portalAbi,
      logs,
      eventName: 'AddedFile',
    })

    if (parsedLog.length === 0) throw new Error('Failed to upload file')
    // @ts-ignore
    fileMetadata.fileId = Number(parsedLog[0].args.fileId)
    fileMetadata.contentHash = contentHash
    fileMetadata.metadataHash = metadataHash

    if (updateFileList && typeof updateFileList === 'function')
      updateFileList(fileMetadata)
  }

  const deleteFile = async (fileId: number) => {
    if (!pinataSDK || !portalDetails || !agentInstance)
      throw new Error('Not initialized')

    const callData = encodeFunctionData({
      abi: portalAbi,
      functionName: 'editFile',
      args: [
        fileId,
        DELETE_FILE_METADATA.metadataIpfsHash,
        DELETE_FILE_METADATA.contentIpfsHash,
        '',
        0,
        0,
      ],
    })

    const { success, logs } = await agentInstance.executeUserOperationRequest(
      {
        data: callData,
        contractAddress: portalDetails.portalAddress,
      },
      FILE_TRX_TIMEOUT
    )

    if (!success) throw new Error('Failed to delete file')

    const parsedLog = parseEventLogs({
      abi: portalAbi,
      logs,
      eventName: 'EditedFile',
    })

    if (parsedLog.length === 0) throw new Error('Failed to delete file')
  }

  const updatePortal = async (
    name: string,
    description: string,
    sections: PortalSection[]
  ) => {
    if (!pinataSDK || !portalDetails || !agentInstance)
      throw new Error('Not initialized')

    const portalMetadata = {
      name,
      description,
      pinataGateway: portalDetails.pinataGateway,
      sections: sections.sort((a, b) => a.orderNumber - b.orderNumber),
    }

    // Upload new metadata to IPFS
    const { cid } = await pinataSDK.upload.public.json(portalMetadata, {
      metadata: {
        name: `${name}.json`,
      },
    })

    // Call contract to update metadata
    const callData = encodeFunctionData({
      abi: portalAbi,
      functionName: 'updateMetadata',
      args: [cid],
    })

    const { success } = await agentInstance.executeUserOperationRequest(
      {
        data: callData,
        contractAddress: portalDetails.portalAddress,
      },
      FILE_TRX_TIMEOUT
    )

    if (!success) throw new Error('Failed to update portal')

    // Update local storage with new details
    const updatedDetails = {
      ...portalDetails,
      name,
      description,
    }
    await setOwnerDetails(updatedDetails)
  }

  const updateFileName = async (
    fileId: number,
    newName: string,
    currentMetadataHash: string,
    currentContentHash: string,
    newSectionId: string
  ) => {
    if (!pinataSDK || !portalDetails || !agentInstance)
      throw new Error('Not initialized')

    try {
      const gateway = portalDetails.pinataGateway.startsWith('https://')
        ? portalDetails.pinataGateway
        : `https://${portalDetails.pinataGateway}`

      const response = await fetch(`${gateway}/ipfs/${currentMetadataHash}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`)
      }

      const metadata = await response.json()

      // Update both name and sectionId
      const updatedMetadata = {
        ...metadata,
        name: newName,
        sectionId: newSectionId,
      }

      const { cid: newMetadataHash } = await pinataSDK.upload.public.json(
        updatedMetadata,
        {
          metadata: {
            name: `${newName}_metadata.json`,
          },
        }
      )

      const callData = encodeFunctionData({
        abi: portalAbi,
        functionName: 'editFile',
        args: [fileId, newMetadataHash, currentContentHash, '', 0, 0],
      })

      const { success } = await agentInstance.executeUserOperationRequest(
        {
          data: callData,
          contractAddress: portalDetails.portalAddress,
        },
        FILE_TRX_TIMEOUT
      )

      if (!success) throw new Error('Failed to update file')
    } catch (error) {
      console.error('Failed to update file:', error)
      throw error
    }
  }

  return (
    <PortalContext.Provider
      value={{
        setCurrentFlow,
        createPortal,
        currentFlow,
        portalDetails,
        setOwnerDetails,
        addFile,
        agentAddress,
        deleteFile,
        clearOwnerDetails,
        updatePortal,
        updateFileName,
      }}
    >
      {children}
    </PortalContext.Provider>
  )
}
