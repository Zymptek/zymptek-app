import React, { useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Paperclip, Image as ImageIcon } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-5 w-5 text-brand-400" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Attach file</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="h-5 w-5 text-brand-400" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Attach image</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}

export default FileUpload
