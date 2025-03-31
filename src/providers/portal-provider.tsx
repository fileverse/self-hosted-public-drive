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
import { HomePageFlow, PortalFile } from '../types'
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
    notes?: string
  ) => Promise<void>
  agentAddress: Hex | null
  deleteFile: (fileId: number) => Promise<void>
  clearOwnerDetails: () => void
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
    notes?: string
  ) => {
    if (!pinataSDK || !portalDetails || !agentInstance)
      throw new Error('Not initialized')

    const fileMetadata = {
      name: file.name,
      fileSize: file.size,
      fileType: file.type,
      extension: getFileExtension(file.name),
      createdAt: Date.now(),
      notes,
    } as PortalFile

    const { cid: metadataHash } = await pinataSDK.upload.public.json(
      {
        ...fileMetadata,
      },
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
      }}
    >
      {children}
    </PortalContext.Provider>
  )
}
