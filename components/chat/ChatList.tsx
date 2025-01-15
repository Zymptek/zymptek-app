import React, { useState, useCallback, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useChat } from '@/context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { ChatListItem } from '@/types/chats/types'

const ChatList: React.FC = () => {
  const { 
    conversations, 
    setCurrentConversation,
    currentConversation,
    loadMessages
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = useMemo(() => conversations.filter(chat => 
    `${chat.otherUser.first_name} ${chat.otherUser.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.lastMessage?.content || '').toLowerCase().includes(searchQuery.toLowerCase())
  ), [conversations, searchQuery]);

  const handleConversationClick = useCallback((conversation: ChatListItem) => {
    setCurrentConversation(conversation);
    loadMessages(conversation.id);
  }, [setCurrentConversation, loadMessages]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-300 to-brand-200 bg-clip-text text-transparent">
          Messages
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-200 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search conversations..."
            className="pl-10 pr-4 py-2 w-full bg-background-light border-border-light rounded-xl focus:ring-brand-200 focus:border-brand-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-grow px-3">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 pb-4"
        >
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleConversationClick(chat)}
              className={cn(
                "flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer",
                "hover:bg-background-light hover:shadow-md",
                currentConversation?.id === chat.id
                  ? "bg-brand-100/10 shadow-lg"
                  : "bg-background"
              )}
            >
              <Avatar className="w-12 h-12 mr-4 ring-2 ring-offset-2 ring-brand-100">
                <AvatarImage 
                  src={chat.otherUser.avatar_url || ''} 
                  alt={`${chat.otherUser.first_name} ${chat.otherUser.last_name}`} 
                />
                <AvatarFallback className="bg-brand-200 text-white font-medium">
                  {chat.otherUser.first_name[0]}{chat.otherUser.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold truncate text-brand-300">
                    {chat.otherUser.first_name} {chat.otherUser.last_name}
                  </h3>
                  <span className="text-xs text-brand-200 whitespace-nowrap ml-2">
                    {chat.last_message ? formatDistanceToNow(new Date(chat.last_message.created_at), { addSuffix: true }) : 'No messages'}
                  </span>
                </div>
                <p className="text-sm truncate text-brand-200">
                  {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 bg-brand-300 text-white font-medium min-w-[1.5rem] h-6 flex items-center justify-center rounded-full"
                >
                  {chat.unreadCount}
                </Badge>
              )}
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  )
}

export default ChatList;
