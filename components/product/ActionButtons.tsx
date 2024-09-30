import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import MessageModal from '@/components/chat/MessageModal';

interface ActionButtonsProps {
  isProductSeller: boolean;
  productId: string;
  sellerId: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isProductSeller, productId, sellerId }) => {
  const router = useRouter();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <Button className="w-full bg-brand-200 hover:bg-brand-300 text-white">
        Start Order
      </Button>
      <Button 
        className="w-full btn-primary hover:bg-primary-dark text-white"
        onClick={() => setIsMessageModalOpen(true)}
      >
        <Send className="mr-2" />
        Send Inquiry
      </Button>
      {isProductSeller && (
        <Button 
          onClick={() => router.push(`/product/${productId}/edit`)}
          className="w-full col-span-2 btn-primary hover:bg-brand-200"
        >
          Edit Product
        </Button>
      )}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        sellerId={sellerId}
      />
    </div>
  );
};

export default ActionButtons;