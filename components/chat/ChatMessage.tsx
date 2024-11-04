import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChatMessage, ChatMessage as ChatMessageType } from '@/types/chats/types'

const ChatMessageComponent: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (message.file_path) {
      const getSignedUrl = async () => {
        const { data, error } = await supabase.storage
          .from('chat-attachments')
          .createSignedUrl(message.file_path!, 3600) // URL valid for 1 hour

        if (error) {
          console.error('Error getting signed URL:', error)
        } else if (data) {
          setSignedUrl(data.signedUrl)
        }
      }

      getSignedUrl()
    }
  }, [message.file_path, supabase])

  return (
    <div className="message">
      {message.content && <p>{message.content}</p>}
      {message.file_type === 'image' && signedUrl && (
        <Image src={signedUrl} alt="Attached image" width={200} height={200} />
      )}
      {message.file_type === 'document' && signedUrl && (
        <a href={signedUrl} target="_blank" rel="noopener noreferrer">View Document</a>
      )}
    </div>
  )
}

export default ChatMessageComponent
