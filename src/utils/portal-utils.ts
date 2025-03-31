import { fromUint8Array } from 'js-base64'
import {
  exportKeyPair,
  generateRandomRSAKeyPair,
  generateRandomUcanEdKeyPair,
} from './crypto-utils'
import {
  createPublicClient,
  encodeFunctionData,
  Hex,
  http,
  parseEventLogs,
  sha256,
} from 'viem'
import { registryAbi } from '../data/registry-abi'
import { IAgentClient } from './smart-account-agent'
import { REGISTRY_CONTRACT_ADDRESS } from './constants'
import { gnosis } from 'viem/chains'
import { portalAbi } from '../data/portal-abi'
import { getIPFSAsset } from './ipfs-utils'
export const FILE_TRX_TIMEOUT = 30000 // 30 seconds
export const PORTAL_MINT_TIMEOUT = 90000 // 90 seconds

export const publicClient = createPublicClient({
  chain: gnosis,
  transport: http(import.meta.env.VITE_RPC_URL),
})

export const generatePortalKeys = async () => {
  const editKeyPair = await generateRandomUcanEdKeyPair()
  const viewKeyPair = await generateRandomUcanEdKeyPair()
  const editSecret = await editKeyPair.export()
  const viewSecret = await viewKeyPair.export()
  const editDid = editKeyPair.did()
  const viewDid = viewKeyPair.did()
  // serverKeys
  const {
    publicKey: collaboratorPublicKey,
    privateKey: collaboratorPrivateKey,
  } = await exportKeyPair(await generateRandomRSAKeyPair())
  // memberKeys
  const { publicKey: memberPublicKey, privateKey: memberPrivateKey } =
    await exportKeyPair(await generateRandomRSAKeyPair())
  // ownerKeys
  const { publicKey: ownerPublicKey, privateKey: ownerPrivateKey } =
    await exportKeyPair(await generateRandomRSAKeyPair())

  return {
    viewSecret,
    editSecret,
    editDID: editDid,
    viewDID: viewDid,
    editKeyPair,
    ownerEncryptionKey: fromUint8Array(new Uint8Array(ownerPublicKey)),
    ownerDecryptionKey: fromUint8Array(new Uint8Array(ownerPrivateKey)),
    memberEncryptionKey: fromUint8Array(new Uint8Array(memberPublicKey)),
    memberDecryptionKey: fromUint8Array(new Uint8Array(memberPrivateKey)),
    portalEncryptionKey: fromUint8Array(new Uint8Array(collaboratorPublicKey)),
    portalDecryptionKey: fromUint8Array(new Uint8Array(collaboratorPrivateKey)),
  }
}

export const getPortalKeyVerifiers = (secretFileContent: any) => {
  const encoder = new TextEncoder()

  return {
    portalEncryptionKeyVerifier: sha256(
      encoder.encode(secretFileContent.portalEncryptionKey)
    ),
    portalDecryptionKeyVerifier: sha256(
      encoder.encode(secretFileContent.portalDecryptionKey)
    ),
    memberEncryptionKeyVerifer: sha256(
      encoder.encode(secretFileContent.memberEncryptionKey)
    ),
    memberDecryptionKeyVerifer: sha256(
      encoder.encode(secretFileContent.memberDecryptionKey)
    ),
  }
}

export const mintPortal = async (
  portalMetadataHash: string,
  agentInstance: IAgentClient
) => {
  try {
    const portalKeys = await generatePortalKeys()
    const keyVerifiers = getPortalKeyVerifiers(portalKeys)

    const encodedCallData = encodeFunctionData({
      abi: registryAbi,
      functionName: 'mint',
      args: [
        portalMetadataHash,
        portalKeys.viewDID,
        portalKeys.editDID,
        keyVerifiers.portalEncryptionKeyVerifier.valueOf(),
        keyVerifiers.portalDecryptionKeyVerifier.valueOf(),
        keyVerifiers.memberEncryptionKeyVerifer.valueOf(),
        keyVerifiers.memberDecryptionKeyVerifer.valueOf(),
      ],
    })

    const { logs } = await agentInstance.executeUserOperationRequest(
      {
        data: encodedCallData,
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
      },
      PORTAL_MINT_TIMEOUT
    )

    const parsedLog = parseEventLogs({
      abi: registryAbi,
      eventName: 'Mint',
      logs,
    })
    if (parsedLog.length === 0) throw new Error('No Portal Mint Event Found!')

    // @ts-ignore
    const creds = {
      owner: agentInstance.getAgentAddress(),
      // @ts-ignore
      portalAddress: parsedLog[0]?.args?.portal,
      credentials: {
        editDID: portalKeys.editDID,
        editSecret: portalKeys.editSecret,
        viewDID: portalKeys.viewDID,
        viewSecret: portalKeys.viewSecret,
      },
      serverKeys: {
        memberDecryptionKey: portalKeys.memberDecryptionKey,
        memberEncryptionKey: portalKeys.memberEncryptionKey,
        ownerDecryptionKey: portalKeys.ownerDecryptionKey,
        ownerEncryptionKey: portalKeys.ownerEncryptionKey,
        portalDecryptionKey: portalKeys.portalDecryptionKey,
        portalEncryptionKey: portalKeys.portalEncryptionKey,
      },
    }
    return creds
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getPortalFileCount = async (contractAddress: Hex) => {
  const count = await publicClient.readContract({
    address: contractAddress,
    abi: portalAbi,
    functionName: 'getFileCount',
  })

  return Number(count)
}

export const getContractFile = async (fileId: number, contractAddress: Hex) => {
  const [metadataHash, contentHash] = (await publicClient.readContract({
    address: contractAddress,
    abi: portalAbi,
    functionName: 'files',
    args: [fileId],
  })) as [string, string]

  return { metadataHash, contentHash }
}

export const getPortalKeysVerifiers = async (contractAddress: Hex) => {
  return await publicClient.readContract({
    address: contractAddress,
    abi: portalAbi,
    functionName: 'keyVerifiers',
    args: [0],
  })
}

export const getPortalOwner = async (contractAddress: Hex) => {
  return await publicClient.readContract({
    address: contractAddress,
    abi: portalAbi,
    functionName: 'owner',
  })
}

export const validateOwner = async (
  privateKeyOwner: Hex,
  portalAddress: Hex
) => {
  const portalOwner = await getPortalOwner(portalAddress)

  return privateKeyOwner === portalOwner
}

export const getPortalMetadata = async (
  portalAddress: Hex,
  pinataGateway?: string
) => {
  const metadataHash = (await publicClient.readContract({
    address: portalAddress,
    abi: portalAbi,
    functionName: 'metadataIPFSHash',
  })) as string
  const metadata = await getIPFSAsset({
    ipfsHash: metadataHash,
    gatewayURL: pinataGateway,
  })
  return metadata
}
