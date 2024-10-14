import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Product } from '@/hooks/useProductEditor';
import { Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {  useAuth } from '@/context/AuthContext';

interface ModalState {
    isOpen: boolean;
    product: Product | null;
}

interface UseModalReturn extends ModalState {
    openModal: (info: Product) => void;
    closeModal: () => void;
}

const useModal = (): UseModalReturn => {
    const [state, setState] = useState<ModalState>({
        isOpen: false,
        product: null,
    });

    const openModal = (info: Product) => {
        setState({ isOpen: true, product: info });
    };

    const closeModal = () => {
        setState({ isOpen: false, product: null });
    };

    return { ...state, openModal, closeModal };
};

const B2BInquiryModal: React.FC<ModalState & { closeModal: () => void; }> = ({ isOpen, closeModal, product }) => {
    const [inquiry, setInquiry] = useState('');
    const { toast } = useToast();
    const { profile } = useAuth();

    const handleSubmit = async () => {
    };

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-brand-200">Product Inquiry</DialogTitle>
                    <DialogDescription>
                        {product ? `Inquiry for ${product.headline}` : 'Please provide the details of your inquiry below.'}
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    className="min-h-[100px] resize-none w-full"
                    placeholder="Type your message here..."
                    value={inquiry}
                    onChange={(e) => setInquiry(e.target.value)}
                />
                <DialogFooter className="sm:justify-start">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Send Inquiry
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            type="button"
                            className="btn btn-outline"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>
                    </motion.div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

interface OpenInquiryButtonProps {
    openModal: (info: Product) => void;
    productInfo: Product;
}

const OpenInquiryButton: React.FC<OpenInquiryButtonProps> = ({ openModal, productInfo }) => (
    <Button onClick={() => openModal(productInfo)} className="btn btn-primary flex items-center">
        <Send className="mr-2" />
        Send Inquiry
    </Button>
);

export { useModal, B2BInquiryModal, OpenInquiryButton };