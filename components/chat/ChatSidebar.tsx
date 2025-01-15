import React, { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ChatListItem } from '@/types/chats/types'

export default function ChatSidebar() {
  const { conversations, currentConversation, setCurrentConversation, loadMessages } = useChat()
  const { user: currentUser } = useAuth()
  const [search, setSearch] = useState('')

  const filteredConversations = useMemo(() => conversations.filter(conversation => {
    const otherUser = conversation.buyer_id === currentUser?.id 
      ? conversation.seller 
      : conversation.buyer
    
    return (
      `${otherUser?.first_name} ${otherUser?.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (conversation.lastMessage?.content || '').toLowerCase().includes(search.toLowerCase())
    )
  }), [conversations, search, currentUser?.id])

  const handleConversationClick = useCallback((conversation: ChatListItem) => {
    setCurrentConversation(conversation)
    loadMessages(conversation.id)
  }, [setCurrentConversation, loadMessages])

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 bg-background/50 border-border
              focus:ring-2 focus:ring-brand-200/20 focus:border-brand-200"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {filteredConversations.map((conversation) => {
            const isActive = conversation.id === currentConversation?.id
            const otherUser = conversation.buyer_id === currentUser?.id 
              ? conversation.seller 
              : conversation.buyer

            return (
              <motion.button
                key={conversation.id}
                initial={false}
                animate={{ scale: isActive ? 0.98 : 1 }}
                onClick={() => handleConversationClick(conversation)}
                className={cn(
                  "w-full p-4 flex items-start space-x-4 rounded-xl mb-2",
                  "transition-all duration-300 hover:shadow-md",
                  isActive 
                    ? "bg-brand-300/10 hover:bg-brand-300/20 shadow-sm" 
                    : "hover:bg-background/80",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                )}
              >
                <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-brand-100/50">
                  <AvatarImage src={otherUser?.avatar_url || ''} />
                  <AvatarFallback className="bg-brand-200 text-white">
                    {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-base font-semibold text-brand-300 truncate">
                      {otherUser?.first_name} {otherUser?.last_name}
                    </p>
                    {conversation.lastMessage?.created_at && (
                      <span className="text-xs text-brand-200 ml-2">
                        {formatDistanceToNow(new Date(conversation.lastMessage.created_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-brand-200 truncate pr-2">
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="shrink-0 h-5 min-w-[20px] px-1.5 rounded-full bg-brand-300 text-white text-xs font-medium flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
} 