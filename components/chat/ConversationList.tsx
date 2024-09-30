import React from 'react';
import { useMessage } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId: string | null;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelectConversation, selectedConversationId }) => {
  const { conversations, totalUnreadCount } = useMessage();

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {conversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
              selectedConversationId === conversation.id ? 'bg-brand-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={conversation.other_user?.avatar_url} alt={`${conversation.other_user?.first_name} ${conversation.other_user?.last_name}`} />
            <AvatarFallback>{conversation.other_user?.first_name?.[0]}{conversation.other_user?.last_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{conversation.other_user?.first_name} {conversation.other_user?.last_name}</h3>
              {totalUnreadCount > 0 && (
                <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
                  {totalUnreadCount}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 truncate flex-grow">{conversation.last_message}</p>
              <small className="text-gray-500 text-xs ml-2 whitespace-nowrap">
                {formatDistanceToNow(new Date(conversation.last_message_timestamp), { addSuffix: true })}
              </small>
            </div>
          </div>
        </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ConversationList;