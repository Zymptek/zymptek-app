import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '@/app/(auth-pages)/sign-in/page';
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

describe('SignInPage', () => {
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

  it('renders sign in page correctly', () => {
    render(<SignInPage />);
    
    // Check for main elements
    expect(screen.getByText('Sign in to Zymptek')).toBeInTheDocument();
    expect(screen.getByText('Access your procurement dashboard')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Or continue with email')).toBeInTheDocument();
  });

  it('redirects to home when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(<SignInPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('handles Google sign in correctly', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    render(<SignInPage />);

    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.any(String),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
    });
  });

  it('displays features section on desktop', () => {
    render(<SignInPage />);
    
    expect(screen.getByText('Streamline Your Supply Chain')).toBeInTheDocument();
    expect(screen.getByText('Direct Manufacturer Access')).toBeInTheDocument();
    expect(screen.getByText('Efficient Supply Chain')).toBeInTheDocument();
    expect(screen.getByText('Business Analytics')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Network')).toBeInTheDocument();
  });

  it('displays sign in form links', () => {
    render(<SignInPage />);
    
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });
}); 