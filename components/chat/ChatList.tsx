import React, { useState, useEffect, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useChat } from '@/context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { ChatListItem, Conversation } from '@/types/chats/types'

const ChatList: React.FC = () => {
  const { 
    conversations, 
    setCurrentConversation,
    currentConversation,
    loadMessages
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = conversations.filter(chat => 
    `${chat.otherUser.first_name} ${chat.otherUser.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.lastMessage?.content || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = useCallback((conversation: ChatListItem) => {
    setCurrentConversation(conversation);
    loadMessages(conversation.id);
  }, [setCurrentConversation, loadMessages]);

  return (
    <div className="w-full max-w-md shadow-lg overflow-hidden" style={{ background: 'var(--background-light)' }}>
      <div className="p-6 text-white" style={{ background: 'var(--background-gradient)' }}>
        <div className="flex items-center justify-start mb-4">
          <h4 className="text-2xl font-bold">Chats</h4>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search contacts or messages"
            className="pl-10 pr-4 py-2 w-full bg-white bg-opacity-20 border-none rounded-full text-white placeholder-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[500px]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4 space-y-2"
        >
          {filteredChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleConversationClick(chat)}
            >
              <div
                className={cn(
                  "flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 cursor-pointer",
                  "hover:bg-white hover:shadow-md",
                  currentConversation?.id === chat.id
                    ? "bg-white border-l-4 border-brand-300 shadow-md"
                    : "bg-background-light"
                )}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.otherUser.avatar_url || ''} alt={`${chat.otherUser.first_name} ${chat.otherUser.last_name}`} />
                  <AvatarFallback className="bg-brand-200 text-white">{chat.otherUser.first_name[0]}{chat.otherUser.last_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      currentConversation?.id === chat.id ? "text-brand-300" : "text-brand-400"
                    )}>
                      {chat.otherUser.first_name} {chat.otherUser.last_name}
                    </p>
                    <span className="text-xs text-brand-200 whitespace-nowrap ml-2">
                      {chat.last_message_at ? formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true }) : 'No messages'}
                    </span>
                  </div>
                  <p className="text-sm text-brand-400 truncate max-w-[200px]">
                    {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-brand-300 text-white">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
              {index < filteredChats.length - 1 && (
                <div className="h-px bg-gray-200 my-2" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  )
}

export default ChatList;
