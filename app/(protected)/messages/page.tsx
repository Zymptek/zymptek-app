'use client';

import React, { useState } from 'react';
import ConversationList from '@/components/chat/ConversationList';
import MessageList from '@/components/chat/MessageList';
import { useMessage } from '@/context/MessageContext';
import { MessageSquareText } from 'lucide-react';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { conversations } = useMessage();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Messages</h1>
      <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/3 border-b md:border-r border-gray-200 overflow-y-auto">
          {conversations.length > 0 ? (
            <ConversationList 
              onSelectConversation={setSelectedConversation} 
              selectedConversationId={selectedConversation}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquareText size={48} className="mb-4" />
              <p className="text-center">No conversations yet.</p>
              <p className="text-center">Start chatting with sellers!</p>
            </div>
          )}
        </div>
        <div className="w-full md:w-2/3 flex flex-col">
          {selectedConversation ? (
            <MessageList conversationId={selectedConversation} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquareText size={64} className="mb-4" />
              <p className="text-center text-xl">Select a conversation to view messages</p>
              <p className="text-center mt-2">Or start a new conversation from a seller's profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;