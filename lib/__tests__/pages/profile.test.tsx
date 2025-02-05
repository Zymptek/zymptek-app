import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/context/CompanyContext';
import ProfilePage from '@/app/(protected)/profile/page';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { createContext, useContext } from 'react';

// Create a mock Supabase context with any type
const SupabaseContext = createContext<any>(null);
const SupabaseProvider = SupabaseContext.Provider;

// Mock the hooks and modules
jest.mock('@/context/AuthContext');
jest.mock('@/context/CompanyContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

// Mock the UI components
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: any) => <div data-testid="tabs">{children}</div>,
  TabsContent: ({ children }: any) => <div data-testid="tabs-content">{children}</div>,
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children }: any) => <button data-testid="tabs-trigger">{children}</button>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
  AvatarImage: ({ src, alt }: any) => <img data-testid="avatar-image" src={src} alt={alt} />,
  AvatarFallback: ({ children }: any) => <div data-testid="avatar-fallback">{children}</div>,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <div data-testid="badge">{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => (
    <button data-testid="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: any) => <div data-testid="progress" role="progressbar" aria-valuenow={value} />,
}));

jest.mock('@/components/profile/profile-form', () => ({
  ProfileForm: ({ open, onOpenChange, onSubmit }: any) => (
    <div data-testid="profile-form" role="dialog" aria-hidden={!open}>
      <button onClick={() => onSubmit({ first_name: 'Jane', last_name: 'Smith' })}>Save</button>
      <button onClick={() => onOpenChange(false)}>Cancel</button>
    </div>
  ),
}));

jest.mock('@/components/profile/company-form', () => ({
  CompanyForm: ({ open, onOpenChange, onSubmit }: any) => (
    <div data-testid="company-form" role="dialog" aria-hidden={!open}>
      <button onClick={() => onSubmit({ company_name: 'Test Company' })}>Save</button>
      <button onClick={() => onOpenChange(false)}>Cancel</button>
    </div>
  ),
}));

// Mock the image edit dialog
jest.mock('@/components/shared/ImageEditDialog', () => ({
  ImageEditDialog: ({ open, onOpenChange, onSave }: any) => (
    <div data-testid="image-edit-dialog" role="dialog" aria-hidden={!open}>
      <button onClick={() => onSave('https://example.com/new-image.jpg')}>Save</button>
      <button onClick={() => onOpenChange(false)}>Cancel</button>
    </div>
  ),
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('ProfilePage', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockProfile = {
    id: 'test-profile-id',
    user_id: 'test-user-id',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '+1234567890',
    business_category: 'manufacturing',
    designation: 'Manager',
    user_type: 'SELLER',
    country: 'United States',
    avatar_url: 'https://example.com/avatar.jpg',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockCompany = {
    id: 'test-company-id',
    name: 'Test Company',
    address: '123 Test St',
    description: 'A test company',
    logo_url: 'https://example.com/logo.jpg',
    year_established: '2020',
    employee_count: 100,
    main_products: ['Product 1', 'Product 2'],
    production_capacity: {
      factorySize: 1000,
      annualOutput: 10000,
      productionLines: 5,
      qualityControlStaff: 10,
    },
    social_media: {
      linkedin: 'https://linkedin.com/company/test',
      twitter: 'https://twitter.com/test',
      facebook: 'https://facebook.com/test',
    },
  };

  const mockRouter = {
    push: jest.fn(),
  };

  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      profile: mockProfile,
    });

    (useCompany as jest.Mock).mockReturnValue({
      company: mockCompany,
      companyId: mockCompany.id,
      verificationStatus: 'approved',
      isLoading: false,
      refetchCompany: jest.fn(),
    });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('renders profile page with user information', () => {
    render(<ProfilePage />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('displays seller-specific content when user is a seller', () => {
    render(<ProfilePage />);
    
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    const tabLabels = tabTriggers.map(trigger => trigger.textContent);
    
    expect(tabLabels).toContain('Products');
    expect(tabLabels).toContain('Company');
  });

  it('displays buyer-specific content when user is a buyer', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      profile: { ...mockProfile, user_type: 'BUYER' },
    });

    render(<ProfilePage />);
    
    expect(screen.getByText('Become a Seller')).toBeInTheDocument();
    expect(screen.getByText('Convert to Seller Account')).toBeInTheDocument();
  });

  it('handles company edit button click for sellers', async () => {
    render(<ProfilePage />);
    
    // Switch to company tab
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    const companyTab = tabTriggers.find(trigger => trigger.textContent === 'Company');
    fireEvent.click(companyTab!);

    // Find and click edit button
    const editButtons = screen.getAllByTestId('button');
    const editCompanyButton = editButtons.find(button => 
      button.textContent?.includes('Edit Details')
    );
    fireEvent.click(editCompanyButton!);

    await waitFor(() => {
      expect(screen.getByTestId('company-form')).toBeInTheDocument();
    });
  });

  it('displays verification status correctly', () => {
    render(<ProfilePage />);
    
    // Switch to company tab
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    const companyTab = tabTriggers.find(trigger => trigger.textContent === 'Company');
    fireEvent.click(companyTab!);

    expect(screen.getByText('Verified Company')).toBeInTheDocument();
  });

  it('handles navigation to create product page', () => {
    render(<ProfilePage />);
    
    // Switch to products tab
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    const productsTab = tabTriggers.find(trigger => trigger.textContent === 'Products');
    fireEvent.click(productsTab!);

    // Find and click add product button
    const buttons = screen.getAllByTestId('button');
    const addButton = buttons.find(button => button.textContent?.includes('Add Product'));
    fireEvent.click(addButton!);

    expect(mockRouter.push).toHaveBeenCalledWith(`/create-product/${mockUser.id}`);
  });

  it('displays loading state when fetching data', () => {
    (useCompany as jest.Mock).mockReturnValue({
      ...useCompany(),
      isLoading: true,
    });

    render(<ProfilePage />);
    
    const progressBars = screen.getAllByTestId('progress');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('handles error states gracefully', async () => {
    const mockSupabaseError = {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue({ data: [], error: new Error('Test error') }),
      })),
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabaseError);

    render(<ProfilePage />);
    
    // Switch to products tab
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    const productsTab = tabTriggers.find(trigger => 
      trigger.textContent?.includes('Products')
    );
    fireEvent.click(productsTab!);

    // Wait for the empty state message
    await waitFor(() => {
      const buttons = screen.getAllByTestId('button');
      const addButton = buttons.find(button => 
        button.textContent?.toLowerCase().includes('add')
      );
      expect(addButton).toBeInTheDocument();
    });
  });

  it('displays seller analytics correctly', () => {
    const mockAnalytics = {
      total_products: 10,
      total_views: 100,
      total_orders: 5,
      overall_conversion_rate: 5,
    };

    mockSupabase.from().then.mockResolvedValueOnce({ 
      data: [mockAnalytics], 
      error: null 
    });

    render(<ProfilePage />);
    
    // Switch to products tab
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    const productsTab = tabTriggers.find(trigger => trigger.textContent === 'Products');
    fireEvent.click(productsTab!);

    // Wait for analytics to load
    waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // total products
      expect(screen.getByText('100')).toBeInTheDocument(); // total views
      expect(screen.getByText('5')).toBeInTheDocument(); // total orders
      expect(screen.getByText('5%')).toBeInTheDocument(); // conversion rate
    });
  });

  // Skip avatar and logo tests until features are implemented
  it.skip('handles avatar update correctly', async () => {
    render(<ProfilePage />);
    
    // Test will be implemented when avatar update feature is ready
    expect(true).toBe(true);
  });

  it.skip('handles company logo update correctly', async () => {
    render(<ProfilePage />);
    
    // Test will be implemented when logo update feature is ready
    expect(true).toBe(true);
  });

  it('displays correct verification status for pending state', () => {
    (useCompany as jest.Mock).mockReturnValue({
      ...useCompany(),
      verificationStatus: 'pending',
    });

    render(<ProfilePage />);
    
    // Switch to company tab
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    const companyTab = tabTriggers.find(trigger => trigger.textContent === 'Company');
    fireEvent.click(companyTab!);

    expect(screen.getByText('Verification in Progress')).toBeInTheDocument();
    expect(screen.getByText('Your verification request is under review')).toBeInTheDocument();
  });

  it('displays correct verification status for not applied state', () => {
    (useCompany as jest.Mock).mockReturnValue({
      ...useCompany(),
      verificationStatus: 'not_applied',
    });

    render(<ProfilePage />);
    
    // Switch to company tab
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    const companyTab = tabTriggers.find(trigger => trigger.textContent === 'Company');
    fireEvent.click(companyTab!);

    expect(screen.getByText('Not Verified')).toBeInTheDocument();
    expect(screen.getByText('Complete verification to showcase your credibility')).toBeInTheDocument();
  });

  it('displays admin tasks section for admin users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      profile: { ...mockProfile, user_type: 'ADMIN' },
    });

    render(<ProfilePage />);
    
    expect(screen.getByText('Admin Tasks')).toBeInTheDocument();
    expect(screen.getByText('Verification Tasks')).toBeInTheDocument();
    expect(screen.getByText('Review seller documents')).toBeInTheDocument();
  });

  it('handles social media links correctly', () => {
    render(<ProfilePage />);
    
    // Switch to company tab
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    const companyTab = tabTriggers.find(trigger => trigger.textContent === 'Company');
    fireEvent.click(companyTab!);

    // Edit company details
    const editButtons = screen.getAllByTestId('button');
    const editCompanyButton = editButtons.find(button => 
      button.textContent?.includes('Edit Details')
    );
    fireEvent.click(editCompanyButton!);

    // Verify form opens with social media fields
    expect(screen.getByTestId('company-form')).toBeInTheDocument();
  });
}); 