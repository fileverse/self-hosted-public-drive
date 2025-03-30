import {
  hexToBigInt,
  http,
  PrivateKeyAccount,
  PublicClient,
  toBytes,
  toHex,
} from 'viem'
import {
  createPimlicoClient,
  PimlicoClient,
} from 'permissionless/clients/pimlico'
import { createSmartAccountClient } from 'permissionless'
import { toSafeSmartAccount } from 'permissionless/accounts'

import { generatePrivateKey } from 'viem/accounts'
import { entryPoint07Address } from 'viem/account-abstraction'
import { TSmartAccountClient } from '../types'
import { gnosis } from 'viem/chains'

const PAYMASTER_URL = 'https://api.pimlico.io/v2/gnosis/rpc?apikey='

export const signerToSmartAccount = async (
  signer: PrivateKeyAccount,
  publicClient: PublicClient
) =>
  await toSafeSmartAccount({
    client: publicClient,
    owners: [signer],
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    },
    version: '1.4.1',
  })

export const getSmartAccountClient = async (
  signer: PrivateKeyAccount,
  publicClient: PublicClient,
  apiKey: string
): Promise<{
  smartAccountClient: TSmartAccountClient
  pimlicoClient: PimlicoClient
}> => {
  const smartAccount = await signerToSmartAccount(signer, publicClient)
  const paymasterURL = PAYMASTER_URL + apiKey
  const pimlicoClient = createPimlicoClient({
    transport: http(paymasterURL),
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    },
  })

  return {
    smartAccountClient: createSmartAccountClient({
      account: smartAccount,
      chain: gnosis,
      paymaster: pimlicoClient,
      bundlerTransport: http(paymasterURL),
      userOperation: {
        estimateFeesPerGas: async () =>
          (await pimlicoClient.getUserOperationGasPrice()).fast,
      },
    }),
    pimlicoClient: pimlicoClient,
  }
}

export const getNonce = () =>
  hexToBigInt(
    toHex(toBytes(generatePrivateKey()).slice(0, 24), {
      size: 32,
    })
  )
