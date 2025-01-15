'use client'

import { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { ChatProvider, useChat } from '@/context/ChatContext'
import ChatWindow from '@/components/chat/ChatWindow'
import ChatSidebar from '@/components/chat/ChatSidebar'
import { cn } from '@/lib/utils'

function MessagesContent() {
  const { conversations, currentConversation } = useChat()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Hide footer when component mounts
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (footer) {
      footer.style.display = 'none'
    }
    
    // Show footer when component unmounts
    return () => {
      if (footer) {
        footer.style.display = 'block'
      }
    }
  }, [])

  if (conversations.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center space-y-4 bg-background">
        <div className="p-6 rounded-full bg-brand-100/10 ring-1 ring-brand-200/20">
          <MessageSquare className="w-12 h-12 text-brand-200" />
        </div>
        <p className="text-lg text-brand-200">Your messages will appear here</p>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-background p-6 gap-6">
      {/* Chat Sidebar */}
      <div 
        className={cn(
          "w-full bg-card/95 rounded-2xl shadow-lg",
          "border-2 border-border/80 backdrop-blur-xl",
          "bg-gradient-to-b from-background/50 to-background/30",
          isMobile && currentConversation ? 'hidden' : 'block md:max-w-[400px]'
        )}
      >
        <ChatSidebar />
      </div>

      {/* Chat Window */}
      <div 
        className={cn(
          "flex-1 bg-card/95 rounded-2xl shadow-lg",
          "border-2 border-border/80 backdrop-blur-xl",
          "bg-gradient-to-b from-background/50 to-background/30",
          isMobile && !currentConversation ? 'hidden' : 'block'
        )}
      >
        <ChatWindow />
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <ChatProvider>
      <div className="h-[calc(100vh-4rem)]">
        <MessagesContent />
      </div>
    </ChatProvider>
  )
} 