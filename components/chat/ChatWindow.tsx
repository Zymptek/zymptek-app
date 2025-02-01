'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Send, MoreVertical, Trash2, Check, CheckCheck, ArrowLeft, Paperclip } from "lucide-react"
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'
import FileUpload from '@/components/chat/FileUpload'
import ChatMessage from '@/components/chat/ChatMessage'
import { useToast } from "@/hooks/use-toast"
import { OrderActionButton } from '@/components/order/OrderActionButton'
import { cn } from "@/lib/utils"
import type { Message } from '@/types/chats/types'

const isNewGroup = (
  currentMessage: Message,
  previousMessage: Message | null
) => {
  if (!previousMessage) return true;
  return (
    previousMessage.sender_id !== currentMessage.sender_id ||
    new Date(currentMessage.created_at).getTime() - new Date(previousMessage.created_at).getTime() > 5 * 60 * 1000
  );
};

const ChatWindow: React.FC = () => {
  const { 
    currentConversation, 
    messages, 
    sendMessage, 
    deleteMessage, 
    updateLastRead, 
    setIsTyping, 
    typingUsers, 
    userProfiles, 
    draftMessages, 
    saveDraftMessage, 
    clearDraftMessage, 
    loadMessages, 
    updateMessageStatus,
    setCurrentConversation
  } = useChat()
  const { user: currentUser } = useAuth()
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id)
      setNewMessage(draftMessages[currentConversation.id] || '')
    }
  }, [currentConversation, draftMessages, loadMessages])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
    if (currentConversation) {
      updateLastRead(currentConversation.id)
    }
  }, [messages, currentConversation, updateLastRead])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const message = e.target.value
    setNewMessage(message)
    if (currentConversation) {
      saveDraftMessage(currentConversation.id, message)
      setIsTyping(currentConversation.id, message.length > 0)
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(currentConversation.id, false)
      }, 5000)
    }
  }, [currentConversation, saveDraftMessage, setIsTyping])

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentConversation && (newMessage.trim() || file)) {
      try {
        await sendMessage(newMessage, file || undefined)
        setNewMessage('')
        setFile(null)
        clearDraftMessage(currentConversation.id)
        setIsTyping(currentConversation.id, false)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [currentConversation, newMessage, file, sendMessage, clearDraftMessage, setIsTyping, toast])

  const getTypingIndicator = useCallback(() => {
    if (!currentConversation || !typingUsers[currentConversation.id]) return null;
    
    const typingUserIds = Object.entries(typingUsers[currentConversation.id])
      .filter(([userId, isTyping]) => isTyping && userId !== currentUser?.id)
      .map(([userId]) => userId);

    if (typingUserIds.length === 0) return null;

    const typingNames = typingUserIds.map(userId => {
      const profile = userProfiles[userId];
      return profile ? `${profile.first_name}` : 'Someone';
    });

    if (typingNames.length === 1) {
      return `${typingNames[0]} is typing...`;
    } else if (typingNames.length === 2) {
      return `${typingNames[0]} and ${typingNames[1]} are typing...`;
    } else {
      return `${typingNames.length} people are typing...`;
    }
  }, [currentConversation, typingUsers, currentUser, userProfiles]);

  const renderMessageStatus = useCallback((status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-white/70" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-white/70" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-white" />;
      default:
        return null;
    }
  }, []);

  useEffect(() => {
    if (currentConversation && messages.length > 0 && currentUser) {
      const unreadMessages = messages.filter(m => 
        m.sender_id !== currentUser.id && 
        (m.status === 'sent' || m.status === 'delivered')
      );
      unreadMessages.forEach(message => {
        updateMessageStatus(message.id, 'read');
      });
    }
  }, [currentConversation, messages, currentUser, updateMessageStatus]);

  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return format(new Date(), 'HH:mm');
    return format(new Date(timestamp), 'HH:mm');
  };

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-background-light to-background">
        <div className="max-w-md w-full p-6">
          <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-border-light p-8 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-brand-300 mb-2">Welcome to Chat</h3>
            <p className="text-brand-200">Select a conversation to start chatting</p>
          </div>
        </div>
      </div>
    )
  }

  const otherUser = currentConversation.buyer_id === currentUser?.id 
    ? currentConversation.seller 
    : currentConversation.buyer

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background-light to-background">
      {/* Chat Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 sm:px-6 py-4 border-b border-border-light flex items-center justify-between bg-white/80 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10"
      >
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 hover:bg-background-light transition-colors"
              onClick={() => setCurrentConversation(null)}
            >
              <ArrowLeft className="h-5 w-5 text-brand-300" />
            </Button>
          )}
          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-brand-100 transition-all duration-300 hover:ring-brand-200">
            <AvatarImage src={otherUser?.avatar_url || ''} alt={`${otherUser?.first_name || ''} ${otherUser?.last_name || ''}`} />
            <AvatarFallback className="bg-brand-200 text-white">
              {(otherUser?.first_name?.[0] || '')}{(otherUser?.last_name?.[0] || '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-brand-300">
              {otherUser?.first_name || 'Unknown'} {otherUser?.last_name || ''}
            </h2>
            <AnimatePresence mode="wait">
              {getTypingIndicator() && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-sm text-brand-200 animate-pulse"
                >
                  {getTypingIndicator()}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div>
          <OrderActionButton 
            sellerId={currentConversation.seller_id}
            productId={currentConversation.product_id}
            conversationId={currentConversation.id}
          />
        </div>
      </motion.div>

      {/* Messages Area */}
      <ScrollArea 
        className="flex-grow px-4 py-6 bg-gradient-to-b from-background-light/30 to-background/10" 
        ref={scrollAreaRef}
      >
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isCurrentUser = message.sender_id === currentUser?.id;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
            const isFirstInGroup = isNewGroup(message, prevMessage);
            const isLastInGroup = !nextMessage || isNewGroup(nextMessage, message);
            
            return (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
              />
            );
          })}
        </AnimatePresence>
      </ScrollArea>

      {/* Message Input */}
      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onSubmit={handleSendMessage} 
        className="p-4 border-t border-border-light bg-white/80 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60 sticky bottom-0"
      >
        <div className="flex items-center space-x-2">
          <FileUpload onFileSelect={setFile} />
          <div className="flex-grow relative">
            <Input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="w-full bg-background-light border-border-light rounded-xl pr-12
                focus:ring-2 focus:ring-brand-200/20 focus:border-brand-200
                transition-all duration-300"
            />
            <Button 
              type="submit" 
              size="icon" 
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 rounded-lg transition-all duration-300",
                newMessage.trim() || file
                  ? "bg-brand-300 hover:bg-brand-400 text-white"
                  : "bg-brand-100/10 text-brand-200"
              )}
              disabled={!newMessage.trim() && !file}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-2 flex items-center space-x-2 p-2 bg-background-light rounded-lg"
            >
              <Paperclip className="h-4 w-4 text-brand-200" />
              <span className="text-sm text-brand-200 truncate flex-1">
                {file.name}
              </span>
              <Button 
                type="button" 
                size="sm" 
                variant="ghost" 
                onClick={() => setFile(null)}
                className="hover:text-red-500 transition-colors"
              >
                Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  )
}

export default ChatWindow