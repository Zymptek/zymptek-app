'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useMessage } from '@/context/MessageContext';
import { useToast } from '@/hooks/use-toast';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, sellerId }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { createConversation, sendMessage } = useMessage();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to send a message.",
      });
      return;
    }
  
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a message.",
      });
      return;
    }
  
    setIsSending(true);
  
    try {
      await createConversation(user.id, sellerId, message);
  
      toast({
        title: "Message Sent",
        description: "Your inquiry has been sent successfully.",
      });
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Inquiry</DialogTitle>
        </DialogHeader>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[100px]"
          disabled={isSending}
        />
        <Button 
          onClick={handleSendMessage} 
          className="mt-4 btn-primary rounded-xl"
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send Message'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;