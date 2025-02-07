import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from '@/components/profile/profile-form';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { Profile } from '@/lib/types/profile';

// Mock the UI components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div data-testid="dialog">{children}</div>,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
  DialogDescription: ({ children }: any) => <div data-testid="dialog-description">{children}</div>,
  DialogFooter: ({ children }: any) => <div data-testid="dialog-footer">{children}</div>,
}));

jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => <form data-testid="form">{children}</form>,
  FormField: ({ children }: any) => <div data-testid="form-field">{children}</div>,
  FormItem: ({ children }: any) => <div data-testid="form-item">{children}</div>,
  FormLabel: ({ children }: any) => <label data-testid="form-label">{children}</label>,
  FormControl: ({ children }: any) => <div data-testid="form-control">{children}</div>,
  FormMessage: ({ children }: any) => <div data-testid="form-message">{children}</div>,
  FormDescription: ({ children }: any) => <div data-testid="form-description">{children}</div>,
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children }: any) => <button data-testid="select-trigger">{children}</button>,
  SelectValue: ({ children }: any) => <span data-testid="select-value">{children}</span>,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button data-testid="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('ProfileForm', () => {
  const mockProfile: Profile = {
    id: 'test-profile-id',
    user_id: 'test-user-id',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '+1234567890',
    business_category: 'manufacturing',
    designation: 'Manager',
    user_type: 'SELLER',
    country: 'US',
    avatar_url: 'https://example.com/avatar.jpg',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    company_id: null,
    company_profile: null
  };

  const mockCategoryOptions = [
    {
      label: 'Manufacturing',
      value: 'manufacturing',
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Textiles', value: 'textiles' },
      ],
    },
  ];

  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    onSubmit: jest.fn(),
    profile: mockProfile,
    categoryOptions: mockCategoryOptions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile form with initial values', () => {
    render(<ProfileForm {...defaultProps} />);

    const inputs = screen.getAllByTestId('input');
    const firstNameInput = inputs.find(input => input.getAttribute('name') === 'first_name');
    const lastNameInput = inputs.find(input => input.getAttribute('name') === 'last_name');
    const emailInput = inputs.find(input => input.getAttribute('name') === 'email');
    const phoneInput = inputs.find(input => input.getAttribute('name') === 'phone_number');
    const designationInput = inputs.find(input => input.getAttribute('name') === 'designation');

    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(phoneInput).toHaveValue('+1234567890');
    expect(designationInput).toHaveValue('Manager');
  });

  it('validates required fields', async () => {
    render(<ProfileForm {...defaultProps} />);

    const inputs = screen.getAllByTestId('input');
    const firstNameInput = inputs.find(input => input.getAttribute('name') === 'first_name');
    const lastNameInput = inputs.find(input => input.getAttribute('name') === 'last_name');
    const emailInput = inputs.find(input => input.getAttribute('name') === 'email');

    // Clear required fields
    fireEvent.change(firstNameInput!, { target: { value: '' } });
    fireEvent.change(lastNameInput!, { target: { value: '' } });
    fireEvent.change(emailInput!, { target: { value: '' } });

    // Submit form
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);

    // Check for validation messages
    await waitFor(() => {
      const messages = screen.getAllByTestId('form-message');
      const messageTexts = messages.map(msg => msg.textContent);
      expect(messageTexts).toContain('First name is required');
      expect(messageTexts).toContain('Last name is required');
      expect(messageTexts).toContain('Email is required');
    });
  });

  it('validates email format', async () => {
    render(<ProfileForm {...defaultProps} />);

    const inputs = screen.getAllByTestId('input');
    const emailInput = inputs.find(input => input.getAttribute('name') === 'email');

    // Enter invalid email
    fireEvent.change(emailInput!, { target: { value: 'invalid-email' } });

    // Submit form
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);

    // Check for validation message
    await waitFor(() => {
      const messages = screen.getAllByTestId('form-message');
      const messageTexts = messages.map(msg => msg.textContent);
      expect(messageTexts).toContain('Invalid email address');
    });
  });

  it('validates phone number format', async () => {
    render(<ProfileForm {...defaultProps} />);

    const inputs = screen.getAllByTestId('input');
    const phoneInput = inputs.find(input => input.getAttribute('name') === 'phone_number');

    // Enter invalid phone number
    fireEvent.change(phoneInput!, { target: { value: 'invalid-phone' } });

    // Submit form
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);

    // Check for validation message
    await waitFor(() => {
      const messages = screen.getAllByTestId('form-message');
      const messageTexts = messages.map(msg => msg.textContent);
      expect(messageTexts).toContain('Invalid phone number');
    });
  });

  it('handles form submission with valid data', async () => {
    const onSubmit = jest.fn();
    render(<ProfileForm {...defaultProps} onSubmit={onSubmit} />);

    const inputs = screen.getAllByTestId('input');
    const firstNameInput = inputs.find(input => input.getAttribute('name') === 'first_name');
    const lastNameInput = inputs.find(input => input.getAttribute('name') === 'last_name');
    const emailInput = inputs.find(input => input.getAttribute('name') === 'email');
    const phoneInput = inputs.find(input => input.getAttribute('name') === 'phone_number');
    const designationInput = inputs.find(input => input.getAttribute('name') === 'designation');

    // Update form fields
    fireEvent.change(firstNameInput!, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput!, { target: { value: 'Smith' } });
    fireEvent.change(emailInput!, { target: { value: 'jane.smith@example.com' } });
    fireEvent.change(phoneInput!, { target: { value: '+9876543210' } });
    fireEvent.change(designationInput!, { target: { value: 'Director' } });

    // Submit form
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);

    // Check if onSubmit was called with updated values
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone_number: '+9876543210',
        designation: 'Director',
        business_category: 'manufacturing',
      });
    });
  });

  it('handles business category selection', async () => {
    render(<ProfileForm {...defaultProps} />);

    // Open category select
    const selectTrigger = screen.getByTestId('select-trigger');
    fireEvent.click(selectTrigger);

    // Select a category
    const selectItems = screen.getAllByTestId('select-item');
    const electronicsOption = selectItems.find(item => 
      item.getAttribute('data-value') === 'electronics'
    );
    fireEvent.click(electronicsOption!);

    // Submit form
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);

    // Check if form was submitted with selected category
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          business_category: 'electronics',
        })
      );
    });
  });

  it('closes dialog when cancel is clicked', () => {
    render(<ProfileForm {...defaultProps} />);

    const buttons = screen.getAllByTestId('button');
    const cancelButton = buttons.find(button => button.textContent === 'Cancel');
    fireEvent.click(cancelButton!);

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows loading state during submission', async () => {
    const mockSubmit = jest.fn(() => new Promise<void>(resolve => setTimeout(resolve, 1000)));
    render(<ProfileForm {...defaultProps} onSubmit={mockSubmit} />);

    // Submit form
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);

    // Check for loading state
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/saving/i);
    });
  });
}); 