import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Check, CheckCheck, Paperclip } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/types/chats/types'

interface ChatMessageProps {
  message: ChatMessageType
  isCurrentUser: boolean
  isFirstInGroup: boolean
  isLastInGroup: boolean
}

const MessageStatus = ({ status }: { status: string }) => {
  switch (status) {
    case 'sent':
      return <Check className="h-3 w-3 text-white/70" />
    case 'delivered':
      return <CheckCheck className="h-3 w-3 text-white/70" />
    case 'read':
      return <CheckCheck className="h-3 w-3 text-white" />
    default:
      return null
  }
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isCurrentUser,
  isFirstInGroup,
  isLastInGroup
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex",
        isCurrentUser ? "justify-end" : "justify-start",
        !isLastInGroup ? "mb-1" : "mb-3"
      )}
    >
      <div className={cn(
        "max-w-[70%] relative group",
        isCurrentUser ? "ml-12" : "mr-12"
      )}>
        <div
          className={cn(
            "flex flex-col space-y-2 p-4 rounded-lg",
            isCurrentUser
              ? "bg-brand-300 text-white hover:bg-brand-400"
              : "bg-white/80 text-brand-300 hover:bg-white"
          )}
        >
          <div className="break-words">
            {message.content}
          </div>
          {message.file_url && (
            <a 
              href={message.file_url}
              target="_blank"
              rel="noopener noreferrer" 
              className={cn(
                "mt-2 flex items-center gap-2 rounded-lg p-2 transition-colors",
                isCurrentUser 
                  ? "bg-brand-400/20 hover:bg-brand-400/30" 
                  : "bg-background/50 hover:bg-background"
              )}
            >
              <Paperclip className="h-4 w-4 shrink-0" />
              <span className="text-sm truncate">
                {message.file_url.split('/').pop()}
              </span>
            </a>
          )}
          <div className="flex items-center justify-end gap-1 mt-1 min-h-[16px]">
            <span className={cn(
              "text-[11px]",
              isCurrentUser ? "text-white/70" : "text-brand-300/70"
            )}>
              {format(new Date(message.created_at), 'HH:mm')}
            </span>
            {isCurrentUser && <MessageStatus status={message.status} />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage
