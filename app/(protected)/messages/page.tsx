"use client";

import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageSquare } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const { currentConversation, conversations } = useChat();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {conversations.length === 0 ? (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <MessageSquare className="w-16 h-16 mb-4 text-brand-300" />
          <p className="text-2xl text-brand-300">No conversations yet</p>
          <p className="text-brand-200 mt-2">Start a new chat to begin messaging</p>
        </div>
      ) : (
        <>
          <div className={`w-full md:w-1/3 h-full ${isMobile && currentConversation ? 'hidden' : 'block'}`}>
            <ChatList />
          </div>
          <div className={`w-full md:w-2/3 h-full ${isMobile && !currentConversation ? 'hidden' : 'block'}`}>
            {currentConversation ? (
              <ChatWindow />
            ) : (
              <div className="h-full flex items-center justify-center bg-background-light">
                <p className="text-xl text-brand-300">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesPage;
