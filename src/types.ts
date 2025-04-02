import type { SmartAccountClient } from 'permissionless'
import type {
  Chain,
  RpcSchema,
  Client,
  Transport,
  Hex,
  EncodeDeployDataReturnType,
} from 'viem'
import { SmartAccount } from 'viem/account-abstraction'

export enum HomePageFlow {
  CREATE_NEW = 'CREATE_NEW',
  LOGIN_TO_PORTAL = 'LOGIN_TO_PORTAL',
  DOWNLOAD_KEYS = 'DOWNLOAD_KEYS',
}

export type TSmartAccountClient = SmartAccountClient<
  Transport,
  Chain,
  SmartAccount,
  Client,
  RpcSchema
>

export interface IExecuteUserOperationRequest {
  contractAddress: Hex
  data: EncodeDeployDataReturnType
}

export type PortalSection = {
  name: string
  orderNumber: number
  id: string
}

export interface IPortalMetadata {
  data: {
    name: string
    description: string
    pinataGateway: string
    sections: PortalSection[]
  }
  pinataGateway: string
}

export type PortalFile = {
  fileId: number
  name: string
  fileType: string
  fileSize: number
  extension: string
  createdAt: number
  metadataHash: string
  contentHash: string
  sectionId: string
  notes?: string
}

export type CreatePortalInputs = {
  portalName: string
  portalDescription: string
  pinataJWT: string
  pinataGateway: string
  rpcUrl: string
  pimlicoApiKey: string
  sections: PortalSection[]
}
