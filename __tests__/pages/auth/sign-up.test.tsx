import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpPage from '@/app/(auth-pages)/sign-up/page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';

// Mock the required modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href, className }: any) => (
      <a href={href} className={className} onClick={(e) => {
        e.preventDefault();
        (useRouter() as any).push(href);
      }}>
        {children}
      </a>
    ),
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, initial, animate, transition, whileHover, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Factory: () => <div data-testid="factory-icon" />,
  Building2: () => <div data-testid="building-icon" />,
  ShieldCheck: () => <div data-testid="shield-icon" />,
  BadgeDollarSign: () => <div data-testid="badge-dollar-icon" />,
  Eye: () => <div data-testid="eye-icon" aria-label="show password" />,
  EyeOff: () => <div data-testid="eye-off-icon" aria-label="hide password" />,
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
}));

describe('SignUpPage', () => {
  const mockPush = jest.fn();
  const mockSignInWithOAuth = jest.fn();
  const mockSignUp = jest.fn();
  const mockToast = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    (createClientComponentClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
        signUp: mockSignUp,
      },
    });

    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  it('renders sign up page correctly', () => {
    render(<SignUpPage />);
    
    // Check for main elements
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Start your business journey with us')).toBeInTheDocument();
    expect(screen.getByText('Sign Up with Google')).toBeInTheDocument();
    expect(screen.getByText('Or continue with email')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    
    // Check for icons
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('lock-icon')).toHaveLength(2);
    expect(screen.getAllByTestId('eye-icon')).toHaveLength(2);
  });

  it('validates required fields in real-time', async () => {
    render(<SignUpPage />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    
    // Test email validation
    await user.type(emailInput, 'invalid');
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
    
    // Test password validation
    await user.type(passwordInput, 'short');
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
    
    // Test confirm password validation
    await user.clear(passwordInput);
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'DifferentPassword123!');
    await waitFor(() => {
      expect(screen.getByText('Passwords must match')).toBeInTheDocument();
    });

    // Test error clearing
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');
    await waitFor(() => {
      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
    });

    // Clear password fields first
    await user.clear(passwordInput);
    await user.clear(confirmPasswordInput);
    
    // Type matching passwords
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'Password123!');
    
    // Wait for error to clear
    await waitFor(() => {
      expect(screen.queryByText('Passwords must match')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles successful sign up', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    render(<SignUpPage />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Sign Up Successful',
        description: 'Please check your email to verify your account.',
        variant: 'success',
      });
    });
  });

  it('handles sign up error', async () => {
    const errorMessage = 'Email already exists';
    mockSignUp.mockResolvedValue({ error: { message: errorMessage } });
    
    render(<SignUpPage />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: errorMessage,
      });
    });
  });

  it('handles Google sign up', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    render(<SignUpPage />);

    const googleButton = screen.getByRole('button', { name: /Sign Up with Google/i });
    await user.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
      });
    });
  });

  it('navigates to sign in page', async () => {
    render(<SignUpPage />);
    const signInLink = screen.getByText('Sign In');
    await user.click(signInLink);
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('redirects to home when authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });
    
    render(<SignUpPage />);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('toggles password visibility', async () => {
    render(<SignUpPage />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    
    // Initially both fields should be type="password"
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Get toggle buttons (they're the parent elements of the eye icons)
    const toggleButtons = screen.getAllByTestId('eye-icon').map(icon => icon.parentElement);
    
    // Toggle password visibility
    await user.click(toggleButtons[0]!);
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('type', 'text');
    });
    
    // Toggle confirm password visibility
    await user.click(toggleButtons[1]!);
    await waitFor(() => {
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    });
    
    // Toggle back
    await user.click(toggleButtons[0]!);
    await user.click(toggleButtons[1]!);
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });
}); 