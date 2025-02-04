import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpPage from '@/app/(auth-pages)/sign-up/page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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

describe('SignUpPage', () => {
  const mockPush = jest.fn();
  const mockSignInWithOAuth = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup auth context mock
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    // Setup Supabase client mock
    (createClientComponentClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
      },
    });
  });

  it('renders sign up page correctly', () => {
    render(<SignUpPage />);
    
    // Check for main elements
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Start your business journey with us')).toBeInTheDocument();
    expect(screen.getByText('Sign Up with Google')).toBeInTheDocument();
    expect(screen.getByText('Or continue with email')).toBeInTheDocument();
  });

  it('redirects to home when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(<SignUpPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('handles Google sign up correctly', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    render(<SignUpPage />);

    const googleButton = screen.getByText('Sign Up with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
      });
    });
  });

  it('displays features section on desktop', () => {
    render(<SignUpPage />);
    
    expect(screen.getByText('Transform Your Supply Chain')).toBeInTheDocument();
    expect(screen.getByText('Direct Manufacturer Access')).toBeInTheDocument();
    expect(screen.getByText('Secure Trading')).toBeInTheDocument();
    expect(screen.getByText('Cost Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Industry Network')).toBeInTheDocument();
  });

  it('displays sign in link for existing users', () => {
    render(<SignUpPage />);
    
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('handles Google sign up error correctly', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSignInWithOAuth.mockResolvedValue({ error: { message: 'Google sign-in failed' } });

    render(<SignUpPage />);
    const googleButton = screen.getByText('Sign Up with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error with Google sign-in:', 'Google sign-in failed');
    });

    consoleErrorSpy.mockRestore();
  });
}); 