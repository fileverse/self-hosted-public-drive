import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function downloadObjectAsJson(obj: any, filename: string) {
  const jsonString = JSON.stringify(obj, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename + '.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getFileExtension = (fileName: string): string => {
  if (!fileName) return ''
  const lastDotIndex = fileName.lastIndexOf('.')

  // No file extension found
  if (lastDotIndex === -1) return ''

  const extension = fileName.slice(lastDotIndex + 1)

  // Handle cases like "file.tar.gz"
  if (extension.includes('/')) {
    const parts = extension.split('/')
    return parts[parts.length - 1]
  }

  return extension
}

export const getRelativeTime = (timestamp: number) => {
  return dayjs(timestamp).fromNow()
}

export const getNameAndExtension = (name: string) => {
  const extension = getFileExtension(name)
  const nameWithoutExtension = name.replace(`.${extension}`, '')
  return { name: nameWithoutExtension, extension }
}
