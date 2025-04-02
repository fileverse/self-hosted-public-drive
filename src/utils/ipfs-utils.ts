import { BASE_IPFS_GATEWAY_URL } from './constants'

export const FAILED_IPFS_FETCH_ERROR =
  'Oops failed to load the dDoc from IPFS storage.'

export const getIPFSAsset = async ({
  ipfsHash,
  gatewayURL = BASE_IPFS_GATEWAY_URL,
}: {
  ipfsHash: string
  gatewayURL?: string
}) => {
  const fetchResponse = await withRetry(
    () => fetchFromIPFS(ipfsHash, gatewayURL),
    2
  )
  if (!fetchResponse) throw new Error(FAILED_IPFS_FETCH_ERROR)

  const data = await fetchResponse.json()
  return data
}

export const withRetry = async (fn: () => Promise<any>, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
    }
  }
}

export const sequentialFetch = async (urls: string[]) => {
  for (const url of urls) {
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        return response
      }
      console.warn(`Failed to fetch from ${url} with status ${response.status}`)
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error)
    }
  }
  throw new Error('All fetch requests failed.')
}

export const fetchFromIPFS = async (
  hash: string,
  gatewayURL = BASE_IPFS_GATEWAY_URL
) => {
  try {
    const url = gatewayURL.startsWith('https://')
      ? gatewayURL
      : `https://${gatewayURL}`

    const gatewayUrls = [url]

    const response = await sequentialFetch(
      gatewayUrls.map((url) => `${url}/ipfs/${hash}`)
    )
    return response
  } catch (error) {
    console.error('All requests failed:', error)
    throw new Error(FAILED_IPFS_FETCH_ERROR)
  }
}
