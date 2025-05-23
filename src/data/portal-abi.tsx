import { Abi } from 'viem'

export const portalAbi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_ownerViewDid',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_ownerEditDid',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_trustedForwarder',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'portalEncryptionKeyVerifier',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'portalDecryptionKeyVerifier',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'memberEncryptionKeyVerifier',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'memberDecryptionKeyVerifier',
            type: 'bytes32',
          },
        ],
        internalType: 'struct PortalKeyVerifiers.KeyVerifier',
        name: '_keyVerifier',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'AddedCollaborator',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'fileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'metadataIPFSHash',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'contentIPFSHash',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'gateIPFSHash',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'AddedFile',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'fileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'metadataIPFSHash',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'contentIPFSHash',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'gateIPFSHash',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'EditedFile',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'RegisteredCollaboratorKeys',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'RemovedCollaborator',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'RemovedCollaboratorKeys',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'portalEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'portalDecryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'memberEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'memberDecryptionKeyVerifier',
        type: 'bytes32',
      },
    ],
    name: 'UpdatedKeyVerifiers',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'metadataIPFSHash',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'UpdatedPortalMetadata',
    type: 'event',
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collaborator',
        type: 'address',
      },
    ],
    name: 'addCollaborator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_contentIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_gateIPFSHash',
        type: 'string',
      },
      {
        internalType: 'enum FileversePortal.FileType',
        name: 'filetype',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'version',
        type: 'uint256',
      },
    ],
    name: 'addFile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'collaboratorKeys',
    outputs: [
      {
        internalType: 'string',
        name: 'viewDid',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'editDid',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'fileId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_metadataIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_contentIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_gateIPFSHash',
        type: 'string',
      },
      {
        internalType: 'enum FileversePortal.FileType',
        name: 'filetype',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'version',
        type: 'uint256',
      },
    ],
    name: 'editFile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'files',
    outputs: [
      {
        internalType: 'string',
        name: 'metadataIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'contentIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'gateIPFSHash',
        type: 'string',
      },
      {
        internalType: 'enum FileversePortal.FileType',
        name: 'fileType',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'version',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCollaboratorCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCollaboratorKeysCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCollaborators',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFileCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'isCollaborator',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'forwarder',
        type: 'address',
      },
    ],
    name: 'isTrustedForwarder',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'keyVerifiers',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'portalEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'portalDecryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'memberEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'memberDecryptionKeyVerifier',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'metadataIPFSHash',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'viewDid',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'editDid',
        type: 'string',
      },
    ],
    name: 'registerCollaboratorKeys',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'prevCollaborator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'collaborator',
        type: 'address',
      },
    ],
    name: 'removeCollaborator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'removeCollaboratorKeys',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'portalEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'portalDecryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'memberEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'memberDecryptionKeyVerifier',
        type: 'bytes32',
      },
    ],
    name: 'updateKeyVerifiers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataIPFSHash',
        type: 'string',
      },
    ],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as Abi
