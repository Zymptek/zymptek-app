import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useModal, B2BInquiryModal, OpenInquiryButton } from '@/components/product/InquiryModel'; // Adjust the import path as necessary
import { Product } from '@/hooks/useProductEditor';
import { useAuth } from '@/context/AuthContext';

interface ActionButtonsProps {
  isProductSeller: boolean;
  product: Product;
  sellerId: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isProductSeller, product}) => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const { profile } = useAuth();

  return (
    <div className="mt-6 grid grid-cols-1 gap-4">
     <OpenInquiryButton openModal={openModal} productInfo={product} />
      {isProductSeller && (
        <Button 
          onClick={() => router.push(`/product/${product.product_id}/edit`)}
          className="w-full col-span-2 btn-primary hover:bg-brand-200"
        >
          Edit Product
        </Button>
      )}
      <B2BInquiryModal isOpen={isOpen} closeModal={closeModal} product={product}/>
    </div>
  );
};

export default ActionButtons;