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
    <div className="flex flex-col h-full bg-background border-r border-border-light">
      <div className="p-4 bg-background-light">
        <h2 className="text-2xl font-bold text-brand-300 mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-200 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search conversations"
            className="pl-10 pr-4 py-2 w-full bg-white border-brand-100 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-2 space-y-1"
        >
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleConversationClick(chat)}
              className={cn(
                "flex items-center p-3 rounded-lg transition-all duration-300 cursor-pointer",
                "hover:bg-background-light",
                currentConversation?.id === chat.id
                  ? "bg-brand-100 text-white"
                  : "text-brand-300"
              )}
            >
              <Avatar className="w-12 h-12 mr-3">
                <AvatarImage src={chat.otherUser.avatar_url || ''} alt={`${chat.otherUser.first_name} ${chat.otherUser.last_name}`} />
                <AvatarFallback className="bg-brand-200 text-white">
                  {chat.otherUser.first_name[0]}{chat.otherUser.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium truncate">
                    {chat.otherUser.first_name} {chat.otherUser.last_name}
                  </p>
                  <span className="text-xs text-brand-200 whitespace-nowrap ml-2">
                    {chat.last_message_at ? formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true }) : 'No messages'}
                  </span>
                </div>
                <p className="text-sm truncate text-brand-200">
                  {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-brand-300 text-white">
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
