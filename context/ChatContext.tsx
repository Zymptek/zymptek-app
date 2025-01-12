'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { ChatListItem, ChatMessage, Conversation, Profile, TypingUsers } from '@/types/chats/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/context/AuthContext'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'

interface ChatContextType {
  conversations: ChatListItem[]
  currentConversation: Conversation | null
  messages: ChatMessage[]
  loadConversations: () => Promise<void>
  loadMessages: (conversationId: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  sendMessage: (content: string, file?: File) => Promise<void>
  setCurrentConversation: (conversation: Conversation | null) => void
  updateLastRead: (conversationId: string) => Promise<void>
  setIsTyping: (conversationId: string, isTyping: boolean) => void
  typingUsers: TypingUsers
  userProfiles: Record<string, Profile>
  draftMessages: Record<string, string>
  saveDraftMessage: (conversationId: string, message: string) => void
  clearDraftMessage: (conversationId: string) => void
  startNewConversation: (sellerId: string, initialMessage: string, productId?: string) => Promise<void>
  updateMessageStatus: (messageId: string, status: 'delivered' | 'read') => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClientComponentClient()
  const [conversations, setConversations] = useState<ChatListItem[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUsers>({})
  const [userProfiles, setUserProfiles] = useState<Record<string, Profile>>({})
  const [draftMessages, setDraftMessages] = useState<Record<string, string>>({})
  const { user } = useAuth()
  const subscriptionsRef = useRef<(() => void)[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadConversations()
      loadUserProfiles()
      const unsubscribe = subscribeToUpdates()
      return () => {
        unsubscribe()
        subscriptionsRef.current.forEach(unsub => unsub())
        subscriptionsRef.current = []
      }
    }
  }, [user])

  const loadConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          buyer:profiles!buyer_id(*),
          seller:profiles!seller_id(*),
          messages!messages_conversation_id_fkey (
            id,
            content,
            created_at,
            sender_id,
            status
          ),
          conversation_user_status!inner(last_read_at)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedConversations: ChatListItem[] = data.map(conv => {
        const otherUser = conv.buyer_id === user.id ? conv.seller : conv.buyer;
        // Get the last message by sorting the messages array
        const lastMessage = conv.messages.sort((a: { created_at: string | number | Date }, b: { created_at: string | number | Date }) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        const lastReadAt = new Date(conv.conversation_user_status[0].last_read_at);
        const unreadCount = conv.messages.filter((m: ChatMessage) => 
          new Date(m.created_at || '').getTime() > lastReadAt.getTime() && 
          m.sender_id !== user.id && 
          m.status !== 'read'
        ).length;

        return {
          ...conv,
          otherUser,
          lastMessage,
          unreadCount
        };
      });

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, [user, supabase]);

  const updateLastRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('conversation_user_status')
        .upsert({
          conversation_id: conversationId,
          user_id: user.id,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'conversation_id,user_id'
        });

      if (error) throw error;

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 } 
          : conv
      ));
    } catch (error) {
      console.error('Error updating last read:', error);
    }
  }, [user, supabase]);

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(*)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data as ChatMessage[]);
      updateLastRead(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [supabase, updateLastRead]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, [supabase]);

  const sendMessage = useCallback(async (content: string, file?: File) => {
    if (!currentConversation || !user) return;

    try {
      let fileUrl = null;
      let fileType = null;

      if (file) {
        const filePath = `${currentConversation.id}/${Date.now()}-${file.name}`;
        
        // Get a signed URL for uploading
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('chat-attachments')
          .createSignedUploadUrl(filePath);

        if (uploadError) throw uploadError;

        // Upload the file using the signed URL
        const uploadResult = await fetch(uploadData.signedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        });

        if (!uploadResult.ok) throw new Error('Failed to upload file');

        // Store the path, not the signed URL
        fileUrl = filePath;
        fileType = file.type.startsWith('image/') ? 'image' : 'document';
      }

      const newMessage = {
        conversation_id: currentConversation.id,
        sender_id: user.id,
        content,
        file_url: fileUrl,
        file_type: fileType
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select('*, sender:profiles!sender_id(*)')
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data as ChatMessage]);
      updateLastRead(currentConversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentConversation, user, supabase, updateLastRead]);

  const setIsTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (!user) return;

    const typingChannel = supabase.channel(`typing:${conversationId}`);
    
    typingChannel.on('broadcast', { event: 'typing' }, payload => {
      setTypingUsers(prev => ({
        ...prev,
        [conversationId]: {
          ...prev[conversationId],
          [payload.userId]: payload.isTyping // Ensure we use payload.isTyping
        }
      }));
    }).subscribe();

    typingChannel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, isTyping }
    });
  }, [user, supabase]);

  const loadUserProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      const profiles: Record<string, Profile> = {};
      data.forEach(profile => {
        profiles[profile.id] = profile;
      });

      setUserProfiles(profiles);
    } catch (error) {
      console.error('Error loading user profiles:', error);
    }
  }, [supabase]);

  const saveDraftMessage = useCallback((conversationId: string, message: string) => {
    setDraftMessages(prev => ({
      ...prev,
      [conversationId]: message
    }));
  }, []);

  const clearDraftMessage = useCallback((conversationId: string) => {
    setDraftMessages(prev => {
      const newDrafts = { ...prev };
      delete newDrafts[conversationId];
      return newDrafts;
    });
  }, []);

  const startNewConversation = useCallback(async (sellerId: string, initialMessage: string, productId?: string) => {
    if (!user) return;

    try {
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          buyer_id: user.id,
          seller_id: sellerId,
          product_id: productId
        })
        .select()
        .single();

      if (conversationError) throw conversationError;

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          content: initialMessage
        });

      if (messageError) throw messageError;

      await loadConversations();
      setCurrentConversation(conversation);
    } catch (error) {
      console.error('Error starting new conversation:', error);
    }
  }, [user, supabase, loadConversations]);

  const markMessageAsDelivered = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'delivered' })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as delivered:', error);
    }
  }, [supabase]);

  const subscribeToUpdates = useCallback(() => {
    const conversationsSubscription = supabase
      .channel('conversations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    const messagesSubscription = supabase
      .channel('messages_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload: RealtimePostgresChangesPayload<{
          [key: string]: any;
          conversation_id: string;
          sender_id: string;
          id: string | undefined; // Allow for the possibility that id may be undefined
        }>) => {
          if (payload.new && 'conversation_id' in payload.new && payload.new.conversation_id === currentConversation?.id) {
            if ('sender_id' in payload.new && payload.new.sender_id !== user?.id) { // Check if sender_id exists and is not from the current user
              if ('id' in payload.new && payload.new.id) { // Check if id exists before using it
                // Mark the message as delivered if it's not from the current user
                await updateMessageStatus(payload.new.id, 'delivered');
              }
            }
            await loadMessages(payload.new.conversation_id);
          }
          loadConversations();
        }
      )
      .subscribe();

    const readStatusSubscription = supabase
      .channel('read_status_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversation_user_status' },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    type MessagePayload = {
      id: string;
      status: 'sent' | 'delivered' | 'read';
      [key: string]: any;
    }

    const messageStatusSubscription = supabase
      .channel('message_status_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        async (payload: RealtimePostgresChangesPayload<MessagePayload>) => {
          if (payload.new && payload.old && 'status' in payload.new && 'status' in payload.old && payload.new.status !== payload.old.status) {
            setMessages(prev => prev.map(msg => 
              'id' in payload.new && msg.id === payload.new.id ? { ...msg, status: payload.new.status } : msg
            ));
          }
        }
      )
      .subscribe();

    subscriptionsRef.current.push(
      () => supabase.removeChannel(conversationsSubscription),
      () => supabase.removeChannel(messagesSubscription),
      () => supabase.removeChannel(readStatusSubscription),
      () => supabase.removeChannel(messageStatusSubscription)
    );

    return () => {
      subscriptionsRef.current.forEach(unsub => unsub());
      subscriptionsRef.current = [];
    };
  }, [supabase, currentConversation, loadConversations, loadMessages, user, markMessageAsDelivered]);

  const updateMessageStatus = useCallback(async (messageId: string, status: 'delivered' | 'read') => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ status })
        .eq('id', messageId)
        .select();
      
      if (error) throw error;

      if (data && data.length > 0) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        ));
      } else {
        console.warn(`No message found with id ${messageId}`);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }, [supabase]);


  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        loadConversations,
        loadMessages,
        deleteMessage,
        sendMessage,
        setCurrentConversation,
        updateLastRead,
        setIsTyping,
        typingUsers,
        userProfiles,
        draftMessages,
        saveDraftMessage,
        clearDraftMessage,
        startNewConversation,
        updateMessageStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
