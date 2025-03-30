import { Abi } from 'viem'

export const registryAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trustedForwarder',
        type: 'address',
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
        name: 'portal',
        type: 'address',
      },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_resultsPerPage',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_page',
        type: 'uint256',
      },
    ],
    name: 'allPortal',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'portal',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        internalType: 'struct FileversePortalRegistry.Portal[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balancesOf',
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
        internalType: 'bytes32',
        name: '_portalEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_portalDecryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_memberEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_memberDecryptionKeyVerifier',
        type: 'bytes32',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
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
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_resultsPerPage',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_page',
        type: 'uint256',
      },
    ],
    name: 'ownedPortal',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'portal',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        internalType: 'struct FileversePortalRegistry.Portal[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_portal',
        type: 'address',
      },
    ],
    name: 'ownerOf',
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
        internalType: 'address',
        name: '_portal',
        type: 'address',
      },
    ],
    name: 'portalInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'portal',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        internalType: 'struct FileversePortalRegistry.Portal',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as Abi
