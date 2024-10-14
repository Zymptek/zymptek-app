import { Send } from 'lucide-react'; // Importing the Send icon from lucide-react
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type SupplierInfo = {
  isAuthUser: boolean;
  sellerId: string;
  companyName: string;
  location: string;
  description: string;
};

const StickyContactCard = ({ supplierInfo }: { supplierInfo: SupplierInfo }) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  return (
    <div className="sticky top-[200px] sm:z-0 max-w-xs mx-auto p-4 bg-background-light rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-brand-200 text-white flex items-center justify-center rounded-full shadow-md">
          <Send className="text-xl" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-brand-200 mb-2">Contact Supplier</h3>
      <div className="mb-4">
      <h4 className="text-md font-medium text-brand-300 mb-1">{supplierInfo.companyName}</h4>
      <p className="text-gray-700 mb-4">{supplierInfo.description}</p>
      </div>
      <div className="mb-4">
        <h4 className="text-md font-medium text-brand-300 mb-1">Location:</h4>
        <p className="text-gray-600">{supplierInfo.location}</p>
      </div>
      {
        supplierInfo.isAuthUser ?
        <Link href={`/update-profile/${supplierInfo.sellerId}`} passHref>
                <Button className="flex items-center px-4 py-2 rounded-full btn-primary text-white transition-transform hover:scale-105 duration-300 w-full mb-2">
                  Update Profile
                </Button>
              </Link>
        :
        <></>
      }   
    </div>
  );
};

export default StickyContactCard;
