import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignInForm from '@/components/auth/signInForm';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Mock the required modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon" aria-label="show password" />,
  EyeOff: () => <div data-testid="eye-off-icon" aria-label="hide password" />,
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
}));

describe('SignInForm', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup toast mock
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // Mock fetch
    global.fetch = jest.fn();
  });

  it('renders form fields correctly', () => {
    render(<SignInForm />);
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates required fields with proper error messages', async () => {
    render(<SignInForm />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Type and delete in email field to trigger validation
    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(emailInput, 'a');
    await user.clear(emailInput);
    
    // Type and delete in password field to trigger validation
    const passwordInput = screen.getByPlaceholderText('Password');
    await user.type(passwordInput, 'a');
    await user.clear(passwordInput);

    // Wait for both error messages
    await waitFor(() => {
      const emailError = screen.getByText('Email is required');
      const passwordError = screen.getByText('Password is required');
      
      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
      
      // Check if error messages are properly styled
      expect(emailError.className).toContain('text-red-500');
      expect(passwordError.className).toContain('text-red-500');
    });
  });

  it('validates email format', async () => {
    render(<SignInForm />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    
    // Type invalid email
    await user.type(emailInput, 'invalid-email');
    
    // Wait for error message
    await waitFor(() => {
      const errorMessage = screen.getByText('Invalid email address');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.className).toContain('text-red-500');
    });

    // Type valid email and check error clears
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');

    await waitFor(() => {
      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
    });
  });

  it('updates validation in real-time', async () => {
    render(<SignInForm />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // Test email validation
    await user.type(emailInput, 'invalid');
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
    
    await user.type(emailInput, '@example.com');
    await waitFor(() => {
      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
    });
    
    // Test password validation
    await user.type(passwordInput, 'short');
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
    
    await user.type(passwordInput, 'password123');
    await waitFor(() => {
      expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
    });
  });

  it('handles successful form submission', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );

    // Mock window.location
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: { href: '' },
    });

    render(<SignInForm />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123!'
        })
      });
      expect(window.location.href).toBe('/');
    });

    // Restore original location
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: originalLocation,
    });
  });

  it('handles form submission error', async () => {
    const errorMessage = 'Invalid credentials';
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: errorMessage })
      })
    );

    render(<SignInForm />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: errorMessage
      });
    });
  });

  it('handles network error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );

    render(<SignInForm />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Sign In Error',
        description: 'An unexpected error occurred. Please try again.'
      });
    });

    consoleErrorSpy.mockRestore();
  });

  it('toggles password visibility', async () => {
    render(<SignInForm />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Initially shows the Eye icon (show password)
    const toggleButton = screen.getByTestId('eye-icon').parentElement;
    expect(toggleButton).toBeInTheDocument();
    
    // Click to show password
    fireEvent.click(toggleButton!);
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    });
    
    // Click to hide password
    fireEvent.click(toggleButton!);
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });
  });

  it('renders form icons correctly', () => {
    render(<SignInForm />);
    
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('clears validation errors when input becomes valid', async () => {
    render(<SignInForm />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    
    // First enter invalid email
    await user.type(emailInput, 'invalid-email');
    await user.tab();
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
    
    // Clear and enter valid email
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');
    await user.tab();
    
    // Error message should disappear
    await waitFor(() => {
      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
    });
  });

  it('shows all validation errors on submit', async () => {
    render(<SignInForm />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Enter invalid values
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'short');
    await user.click(submitButton);
    
    // Check for both error messages
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });
}); 