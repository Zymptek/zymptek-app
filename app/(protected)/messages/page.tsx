"use client";

import React from 'react';
import { useChat } from '@/context/ChatContext';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageSquare } from 'lucide-react'; // Importing an icon from lucide-react

const MessagesPage: React.FC = () => {
  const { currentConversation, conversations } = useChat();

  return (
    <div className="flex h-screen bg-background">
      {conversations.length === 0 ? (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <MessageSquare className="w-16 h-16 mr-2 text-gray-500" />
          <p className="text-4xl text-gray-500">No conversations started yet.</p>
        </div>
      ) : (
        <>
          <ChatList />
          <div className="flex-grow">
            {currentConversation ? (
              <ChatWindow />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-xl text-gray-500">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesPage;