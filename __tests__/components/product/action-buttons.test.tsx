import { render, screen, fireEvent } from '@testing-library/react';
import ActionButtons from '@/components/product/ActionButtons';
import React from 'react';

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    profile: null,
  }),
}));

jest.mock('@/components/product/InquiryModel', () => ({
  useModal: () => ({
    isOpen: false,
    openModal: jest.fn(),
    closeModal: jest.fn(),
  }),
  OpenInquiryButton: () => <button>Inquiry</button>,
  B2BInquiryModal: () => <div>Mock Modal</div>,
}));

describe('ActionButtons Component', () => {
  const mockProduct = {
    product_id: '123',
    headline: 'Test Product',
    description: 'Test Description',
    category_id: '1',
    seller_id: '456',
    status: 'active',
    image_urls: [],
  };

  const mockProps = {
    isProductSeller: false,
    product: mockProduct,
    sellerId: '456',
  };

  it('should render inquiry button', () => {
    render(<ActionButtons {...mockProps} />);
    const inquiryButton = screen.getByRole('button', { name: /inquiry/i });
    expect(inquiryButton).toBeTruthy();
  });

  it('should show edit button for seller', () => {
    render(<ActionButtons {...mockProps} isProductSeller={true} />);
    const editButton = screen.getByRole('button', { name: /edit product/i });
    expect(editButton).toBeTruthy();
  });

  it('should not show edit button for non-seller', () => {
    render(<ActionButtons {...mockProps} isProductSeller={false} />);
    const editButton = screen.queryByRole('button', { name: /edit product/i });
    expect(editButton).toBeNull();
  });
}); 