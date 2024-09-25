import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isProductSeller: boolean;
  productId: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isProductSeller, productId }) => {
  const router = useRouter();

  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <Button className="w-full bg-brand-200 hover:bg-brand-300 text-white">
        Start Order
      </Button>
      <Button className="w-full btn-secondary hover:bg-secondary-dark text-brand-200">
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
    </div>
  );
};

export default ActionButtons;