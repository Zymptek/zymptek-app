import React, { useEffect, useRef, useState } from 'react';
import { useMessage } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface MessageListProps {
  conversationId: string;
}

const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const { messages, fetchMessages, sendMessage, markAsRead, deleteMessage, editMessage } = useMessage();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      markAsRead(conversationId);
    }
  }, [conversationId, fetchMessages, markAsRead]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData(data);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await sendMessage(conversationId, newMessage);
      setNewMessage('');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(messageId);
    }
  };

  const handleEditMessage = async (messageId: string) => {
    setEditingMessageId(messageId);
    setEditedContent(messages.find(m => m.id === messageId)?.content || '');
  };

  const handleSaveEdit = async () => {
    if (editingMessageId && editedContent.trim()) {
      await editMessage(editingMessageId, editedContent);
      setEditingMessageId(null);
      setEditedContent('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender_id === user!.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.sender_id === user!.id ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
                <div 
                  className={`px-4 py-2 rounded-lg ${
                    message.sender_id === user!.id 
                      ? 'bg-brand-300 text-text-dark' 
                      : 'bg-accent-100 text-text-light'
                  }`}
                >
                  {editingMessageId === message.id ? (
                    <div>
                      <Input
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="mb-2 bg-white text-text-light"
                      />
                      <Button onClick={handleSaveEdit} size="sm" className="btn-primary">Save</Button>
                      <Button onClick={() => setEditingMessageId(null)} size="sm" variant="outline" className="ml-2 btn-secondary">Cancel</Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{message.content}</p>
                      <small className="text-xs opacity-75 mt-1 block">
                        {format(new Date(message.created_at), 'MMM d, h:mm a')}
                      </small>
                      {message.sender_id === user!.id && (
                        <div className="mt-2 flex justify-end space-x-2">
                          <Button onClick={() => handleEditMessage(message.id)} size="sm" variant="ghost" className="text-text-dark hover:bg-hover-bg-light">
                            <Edit size={16} />
                          </Button>
                          <Button onClick={() => handleDeleteMessage(message.id)} size="sm" variant="ghost" className="text-text-dark hover:bg-hover-bg-light">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-border-light">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow mr-2 bg-white text-text-light"
          />
          <Button type="submit" className="btn-primary">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageList;