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
    <div className="space-y-3 p-4 bg-background-light">
      <AnimatePresence>
        {conversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors duration-200 ${
              selectedConversationId === conversation.id ? 'bg-brand-300 text-text-dark' : 'bg-accent-100 text-text-light hover:bg-brand-500'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <Avatar className="h-14 w-14 mr-4">
              <AvatarImage src={conversation.other_user?.avatar_url} alt={`${conversation.other_user?.first_name} ${conversation.other_user?.last_name}`} />
              <AvatarFallback className="bg-white text-text-light bold-700">{conversation.other_user?.first_name?.[0]}{conversation.other_user?.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-semibold text-lg truncate">{conversation.other_user?.first_name} {conversation.other_user?.last_name}</h3>
                {totalUnreadCount > 0 && (
                  <Badge className="bg-brand-100 text-text-light px-2 py-1 text-xs font-bold rounded-full">
                    {totalUnreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm opacity-80 truncate flex-grow pr-2">{conversation.last_message}</p>
                <small className="text-xs whitespace-nowrap opacity-70">
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