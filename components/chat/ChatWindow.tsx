'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Send, MoreVertical, Trash2, Check, CheckCheck, ArrowLeft } from "lucide-react"
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'
import FileUpload from '@/components/chat/FileUpload'
import ChatMessage from '@/components/chat/ChatMessage'
import { useToast } from "@/hooks/use-toast"

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
        return <Check className="w-4 h-4 text-text-dark" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-text-dark" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-text-dark" />;
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

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full bg-background-light text-brand-300">
        Select a conversation to start chatting
      </div>
    )
  }

  const otherUser = currentConversation.buyer_id === currentUser?.id ? currentConversation.seller : currentConversation.buyer

  return (
    <div className="flex flex-col h-full bg-background shadow-xl rounded-lg overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between bg-background text-black">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setCurrentConversation(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10 border-2 border-brand-500">
            <AvatarImage src={otherUser?.avatar_url || ''} alt={`${otherUser?.first_name || ''} ${otherUser?.last_name || ''}`} />
            <AvatarFallback>{(otherUser?.first_name?.[0] || '')}{(otherUser?.last_name?.[0] || '')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{otherUser?.first_name || 'Unknown'} {otherUser?.last_name || ''}</h2>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-black hover:text-brand-100">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-grow p-4 bg-background-light" ref={scrollAreaRef}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.sender_id === currentUser?.id ? 'bg-brand-300 text-white' : 'bg-accent-100 text-gray-800'} rounded-lg p-3 relative group`}>
                <ChatMessage message={message} />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs opacity-70">
                    {format(new Date(message.created_at || ''), 'HH:mm')}
                  </p>
                  {message.sender_id === currentUser?.id && renderMessageStatus(message.status)}
                </div>
                {message.sender_id === currentUser?.id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMessage(message.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {getTypingIndicator() && (
          <div className="text-sm text-gray-500 italic">
            {getTypingIndicator()}
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-background-light">
        <div className="flex items-center space-x-2">
          <FileUpload onFileSelect={setFile} />
          <Input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-grow bg-white"
          />
          {file && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{file.name}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => setFile(null)}>
                Remove
              </Button>
            </div>
          )}
          <Button type="submit" size="icon" className="bg-brand-300 hover:bg-brand-200 text-white">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatWindow
