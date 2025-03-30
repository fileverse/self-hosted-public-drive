import { useCallback, useRef, useState } from 'react'
import { publicClient, validateOwner } from '../utils/portal-utils'
import { AgentClient } from '../utils/smart-account-agent'
import { usePortalContext } from '../providers/portal-provider'

export const useUpload = () => {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<null | string>(null) // 'uploading', 'uploaded', 'failed', 'incorrect', invalid-source
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOwner, setIsOwner] = useState(false)
  const { setOwnerDetails } = usePortalContext()
  // const { setPortalInformation, portalInformation } = usePortalProvider()

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const verifyFileContentFromReader = (reader: FileReader) => {
    reader.onload = async (e) => {
      try {
        const fileContent = JSON.parse(
          decodeURIComponent(e?.target?.result as string)
        )

        const { portalAddress, privateKey, pinataJWT } = fileContent

        if (!portalAddress || !privateKey || !pinataJWT) {
          setUploadState('incorrect')
          return
        }

        const agentInstance = new AgentClient()
        await agentInstance.initializeAgentClient(
          privateKey,
          publicClient,
          pinataJWT
        )

        const isOwner = await validateOwner(
          agentInstance.getAgentAddress(),
          portalAddress
        )

        if (!isOwner) {
          setUploadState('incorrect')
          return
        }

        setUploadState('uploaded')
        await setOwnerDetails({
          ...fileContent,
        })
        setIsOwner(true)
      } catch (err) {
        console.log('err', err)
      }
    }
  }

  const handleFile = (selectedFile: File) => {
    if (selectedFile.name.endsWith('.json')) {
      setUploadState('uploading')
      const reader = new FileReader()
      verifyFileContentFromReader(reader)
      reader.readAsText(selectedFile)
    } else {
      setUploadState('incorrect')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      handleFile(droppedFile)
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      handleFile(selectedFile)
    }
  }, [])

  const onButtonClick = () => {
    inputRef?.current?.click()
  }

  return {
    handleChange,
    handleDrag,
    handleDrop,
    onButtonClick,
    dragActive,
    uploadState,
    setUploadState,
    setFile,
    file,
    isOwner,
    inputRef,
  }
}
