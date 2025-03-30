import * as ucans from '@ucans/ucans'

export const generateRandomUcanEdKeyPair = async (exportable = true) =>
  await ucans.EdKeypair.create({ exportable })

export const generateRandomRSAKeyPair = async () =>
  window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  )

export const exportKeyPair = async (keyPair: CryptoKeyPair) => {
  const publicKey = await window.crypto.subtle.exportKey(
    'spki',
    keyPair.publicKey
  )
  const privateKey = await window.crypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  )
  return { publicKey, privateKey }
}
