import { Account, Hex, PublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { getSmartAccountClient, getNonce } from './pimlico-utils'

import { IExecuteUserOperationRequest, TSmartAccountClient } from '../types'
import { UserOperationReceipt } from 'viem/account-abstraction'
import { PimlicoClient } from 'permissionless/clients/pimlico'

export interface IAgentClient {
  initializeAgentClient: (
    keyMaterial: Hex,
    publicClient: PublicClient,
    apiKey: string
  ) => Promise<void>
  getAgentAddress: () => Hex
  getAgentAccount: () => Account
  destroyAgentClient: () => void
  executeUserOperationRequest: (
    request: IExecuteUserOperationRequest | IExecuteUserOperationRequest[],
    timeout: number
  ) => Promise<UserOperationReceipt>
}

export class AgentClient implements IAgentClient {
  private smartAccountAgent: TSmartAccountClient | null = null
  private readonly MAX_CALL_GAS_LIMIT = 5000000
  private pimlicoClient: PimlicoClient | null = null

  async initializeAgentClient(
    keyMaterial: Hex,
    publicClient: PublicClient,
    apiKey: string
  ) {
    const agentAccount = privateKeyToAccount(keyMaterial)
    const { smartAccountClient, pimlicoClient } = await getSmartAccountClient(
      agentAccount,
      publicClient,
      apiKey
    )
    this.smartAccountAgent = smartAccountClient
    this.pimlicoClient = pimlicoClient
  }

  getSmartAccountAgent(): TSmartAccountClient {
    if (!this.smartAccountAgent) throw new Error('Agent client not initialized')

    return this.smartAccountAgent
  }

  getAgentAddress() {
    const smartAccountAgent = this.getSmartAccountAgent()
    return smartAccountAgent.account.address
  }

  getAgentAccount() {
    const smartAccountAgent = this.getSmartAccountAgent()
    return smartAccountAgent.account
  }

  destroyAgentClient() {
    this.smartAccountAgent = null
  }

  async getCallData(
    request: IExecuteUserOperationRequest | IExecuteUserOperationRequest[]
  ) {
    const agentAccount = this.getAgentAccount()
    if (Array.isArray(request)) {
      if (request.length === 0 || request.length > 10)
        throw new Error('Request length must be between 1 and 10')

      const encodedCallData = []
      for (let i = 0; i < request.length; i++) {
        encodedCallData.push({
          to: request[i].contractAddress,
          data: request[i].data,
          value: BigInt(0),
        })
      }

      return await agentAccount.encodeCalls(encodedCallData)
    }

    return await agentAccount.encodeCalls([
      {
        to: request.contractAddress,
        data: request.data,
        value: BigInt(0),
      },
    ])
  }

  async sendUserOperation(
    request: IExecuteUserOperationRequest | IExecuteUserOperationRequest[]
  ) {
    const smartAccountAgent = this.getSmartAccountAgent()

    const callData = await this.getCallData(request)

    return await smartAccountAgent.sendUserOperation({
      callData,
      callGasLimit: BigInt(this.MAX_CALL_GAS_LIMIT),
      nonce: getNonce(),
    })
  }

  async executeUserOperationRequest(
    request: IExecuteUserOperationRequest | IExecuteUserOperationRequest[],
    timeout: number
  ) {
    const userOpHash = await this.sendUserOperation(request)
    if (!this.pimlicoClient) throw new Error('Pimlico client not initialized')
    return await this.pimlicoClient.waitForUserOperationReceipt({
      hash: userOpHash,
      timeout,
    })
  }

  resetAgentClient() {
    this.smartAccountAgent = null
  }
}
