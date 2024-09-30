"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  last_message: string;
  last_message_timestamp: string;
  buyer_unread_count: number;
  seller_unread_count: number;
  other_user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

interface MessageContextType {
  conversations: Conversation[];
  messages: Message[];
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  createConversation: (buyerId: string, sellerId: string, initialMessage: string) => Promise<string>;
  markAsRead: (conversationId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  totalUnreadCount: number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const supabase = createClientComponentClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);
  const { user } = useAuth();

  const calculateTotalUnreadCount = useCallback((conversations: Conversation[]) => {
    const totalUnread = conversations.reduce((sum, conv) => {
      if (user?.id === conv.buyer_id) {
        return sum + conv.buyer_unread_count;
      } else if (user?.id === conv.seller_id) {
        return sum + conv.seller_unread_count;
      }
      return sum;
    }, 0);
    setTotalUnreadCount(totalUnread);
  }, [user]);

  const debouncedCalculateTotalUnreadCount =useDebounce(calculateTotalUnreadCount, 100);;

  const fetchConversations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('last_message_timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
    } else {
      setConversations(data);
      debouncedCalculateTotalUnreadCount(data);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user) return;

    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
        is_read: false,
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error sending message:', messageError);
      throw messageError;
    }

    setMessages((prevMessages) => [...prevMessages, messageData]);
  };

  const createConversation = async (buyerId: string, sellerId: string, initialMessage: string) => {
    const { data: existingConversation, error: fetchError } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', buyerId)
      .eq('seller_id', sellerId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching conversation:', fetchError);
      throw fetchError;
    }

    if (existingConversation) {
      await sendMessage(existingConversation.id, initialMessage);
      return existingConversation.id;
    }

    const otherUserId = user!.id === buyerId ? sellerId : buyerId;
    const { data: otherUserData, error: otherUserError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .eq('id', otherUserId)
      .single();

    if (otherUserError) {
      console.error('Error fetching other user:', otherUserError);
      throw otherUserError;
    }

    const { data: conversationData, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        buyer_id: buyerId,
        seller_id: sellerId,
        last_message: initialMessage,
        last_message_timestamp: new Date().toISOString(),
        other_user: otherUserData,
        buyer_unread_count: 0,
        seller_unread_count: 0
      })
      .select()
      .single();

    if (conversationError) {
      console.error('Error creating conversation:', conversationError);
      throw conversationError;
    }

    await sendMessage(conversationData.id, initialMessage);
    return conversationData.id;
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    const { error: messageError } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id);

    if (messageError) {
      console.error('Error marking messages as read:', messageError);
    }

    const updateField = user.id === conversations.find(c => c.id === conversationId)?.buyer_id
      ? 'buyer_unread_count'
      : 'seller_unread_count';

    const { error: conversationError } = await supabase
      .from('conversations')
      .update({ [updateField]: 0 })
      .eq('id', conversationId);

    if (conversationError) {
      console.error('Error marking conversation as read:', conversationError);
    } else {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === conversationId ? { ...conv, [updateField]: 0 } : conv
        )
      );
      debouncedCalculateTotalUnreadCount(conversations);
    }
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }

    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
  };

  const editMessage = async (messageId: string, newContent: string) => {
    const { data, error } = await supabase
      .from('messages')
      .update({ content: newContent })
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      console.error('Error editing message:', error);
      throw error;
    }

    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === messageId ? data : msg))
    );
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
      
      const channel = supabase
        .channel('realtime messages and conversations')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handleNewMessage)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, handleConversationUpdate)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleNewMessage = (payload: any) => {
    const newMessage = payload.new as Message;
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    fetchConversations();
  };

  const handleConversationUpdate = (payload: any) => {
    const updatedConversation = payload.new as Conversation;
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === updatedConversation.id ? { ...conv, ...updatedConversation } : conv
      )
    );
    debouncedCalculateTotalUnreadCount(conversations);
  };

  return (
    <MessageContext.Provider
      value={{
        conversations,
        messages,
        fetchConversations,
        fetchMessages,
        sendMessage,
        createConversation,
        markAsRead,
        deleteMessage,
        editMessage,
        totalUnreadCount
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};