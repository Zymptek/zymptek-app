import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '@/app/(auth-pages)/sign-in/page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';

// Mock the required modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

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
  Truck: () => <div data-testid="truck-icon" />,
  BarChart3: () => <div data-testid="chart-icon" />,
  Building2: () => <div data-testid="building-icon" />,
}));

// Mock SignInForm component
jest.mock('@/components/auth/signInForm', () => {
  return {
    __esModule: true,
    default: () => (
      <form data-testid="sign-in-form">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
    ),
  };
});

describe('SignInPage', () => {
  const mockPush = jest.fn();
  const mockSignInWithOAuth = jest.fn();
  const mockToast = jest.fn();

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

    // Setup toast mock
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
      },
      writable: true,
    });
  });

  it('renders sign in page correctly', () => {
    render(<SignInPage />);
    
    expect(screen.getByText('Sign in to Zymptek')).toBeInTheDocument();
    expect(screen.getByText('Access your procurement dashboard')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Or continue with email')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
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
          redirectTo: 'http://localhost:3000/auth/callback',
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
    
    expect(screen.getByTestId('factory-icon')).toBeInTheDocument();
    expect(screen.getByTestId('truck-icon')).toBeInTheDocument();
    expect(screen.getByTestId('chart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('building-icon')).toBeInTheDocument();
  });

  it('displays sign in form links', () => {
    render(<SignInPage />);
    
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });

  it('handles Google sign in error correctly', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSignInWithOAuth.mockResolvedValue({ error: { message: 'Google sign-in failed' } });

    render(<SignInPage />);
    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error with Google sign-in:', 'Google sign-in failed');
    });

    consoleErrorSpy.mockRestore();
  });

  it('navigates to forgot password page', async () => {
    render(<SignInPage />);
    const forgotPasswordLink = screen.getByText('Forgot password?');
    fireEvent.click(forgotPasswordLink);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/forgot-password');
    });
  });

  it('navigates to sign up page', async () => {
    render(<SignInPage />);
    const signUpLink = screen.getByText('Create an account');
    fireEvent.click(signUpLink);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/sign-up');
    });
  });
}); 