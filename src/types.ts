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

export interface IPortalMetadata {
  data: {
    name: string
    description: string
    pinataGateway: string
  }
  pinataGateway: string
}

export type PortalFile = {
  metadataHash: string
  contentHash: string
  fileId: number
  fileType: string
  fileSize: number
  name: string
  extension: string
  createdAt: number
  notes?: string
}
