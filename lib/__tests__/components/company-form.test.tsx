import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CompanyForm } from '@/components/profile/company-form';
import userEvent from '@testing-library/user-event';

describe('CompanyForm', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    onSubmit: jest.fn(),
    loading: false,
  };

  const mockCompanyData = {
    company_profile: {
      company_name: 'Test Company',
      company_address: '123 Test St',
      company_description: 'A test company description',
      overview: {
        mainProducts: 'Product A, Product B',
        totalEmployees: '100',
        yearEstablished: '2020',
      },
      productionCapacity: {
        factorySize: '1000',
        annualOutput: '10000',
        productionLines: '5',
        qualityControlStaff: '10',
      },
      social_media: {
        linkedin: 'https://linkedin.com/company/test',
        twitter: 'https://twitter.com/test',
        facebook: 'https://facebook.com/test',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders company form with empty values initially', () => {
    render(<CompanyForm {...defaultProps} />);

    // Check if form fields are empty initially
    expect(screen.getByLabelText(/company name/i)).toHaveValue('');
    expect(screen.getByLabelText(/company address/i)).toHaveValue('');
    expect(screen.getByLabelText(/company description/i)).toHaveValue('');
  });

  it('validates required fields', async () => {
    render(<CompanyForm {...defaultProps} />);

    // Submit form without filling required fields
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/company address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/company description is required/i)).toBeInTheDocument();
    });
  });

  it('validates social media URLs', async () => {
    render(<CompanyForm {...defaultProps} />);

    // Enter invalid social media URLs
    const linkedinInput = screen.getByLabelText(/linkedin profile/i);
    const twitterInput = screen.getByLabelText(/twitter profile/i);
    const facebookInput = screen.getByLabelText(/facebook profile/i);

    fireEvent.change(linkedinInput, { target: { value: 'invalid-url' } });
    fireEvent.change(twitterInput, { target: { value: 'invalid-url' } });
    fireEvent.change(facebookInput, { target: { value: 'invalid-url' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/invalid linkedin url/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid twitter url/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid facebook url/i)).toBeInTheDocument();
    });
  });

  it('validates numeric fields', async () => {
    render(<CompanyForm {...defaultProps} />);

    // Enter invalid numeric values
    const employeesInput = screen.getByLabelText(/total employees/i);
    const factorySizeInput = screen.getByLabelText(/factory size/i);
    const annualOutputInput = screen.getByLabelText(/annual output/i);

    fireEvent.change(employeesInput, { target: { value: 'abc' } });
    fireEvent.change(factorySizeInput, { target: { value: 'def' } });
    fireEvent.change(annualOutputInput, { target: { value: 'ghi' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/must be a number/i)).toBeInTheDocument();
    });
  });

  it('handles form submission with valid data', async () => {
    const onSubmit = jest.fn();
    render(<CompanyForm {...defaultProps} onSubmit={onSubmit} />);

    // Fill in form fields
    const companyNameInput = screen.getByLabelText(/company name/i);
    const companyAddressInput = screen.getByLabelText(/company address/i);
    const companyDescriptionInput = screen.getByLabelText(/company description/i);
    const mainProductsInput = screen.getByLabelText(/main products/i);
    const employeesInput = screen.getByLabelText(/total employees/i);
    const yearInput = screen.getByLabelText(/year established/i);

    fireEvent.change(companyNameInput, { target: { value: mockCompanyData.company_profile.company_name } });
    fireEvent.change(companyAddressInput, { target: { value: mockCompanyData.company_profile.company_address } });
    fireEvent.change(companyDescriptionInput, { target: { value: mockCompanyData.company_profile.company_description } });
    fireEvent.change(mainProductsInput, { target: { value: mockCompanyData.company_profile.overview.mainProducts } });
    fireEvent.change(employeesInput, { target: { value: mockCompanyData.company_profile.overview.totalEmployees } });
    fireEvent.change(yearInput, { target: { value: mockCompanyData.company_profile.overview.yearEstablished } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    // Check if onSubmit was called with the correct data
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(mockCompanyData);
    });
  });

  it('shows loading state during submission', async () => {
    render(<CompanyForm {...defaultProps} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
  });

  it('closes dialog when cancel is clicked', () => {
    render(<CompanyForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles production capacity fields correctly', async () => {
    const onSubmit = jest.fn();
    render(<CompanyForm {...defaultProps} onSubmit={onSubmit} />);

    // Fill in production capacity fields
    const factorySizeInput = screen.getByLabelText(/factory size/i);
    const annualOutputInput = screen.getByLabelText(/annual output/i);
    const productionLinesInput = screen.getByLabelText(/production lines/i);
    const qcStaffInput = screen.getByLabelText(/quality control staff/i);

    fireEvent.change(factorySizeInput, { target: { value: mockCompanyData.company_profile.productionCapacity.factorySize } });
    fireEvent.change(annualOutputInput, { target: { value: mockCompanyData.company_profile.productionCapacity.annualOutput } });
    fireEvent.change(productionLinesInput, { target: { value: mockCompanyData.company_profile.productionCapacity.productionLines } });
    fireEvent.change(qcStaffInput, { target: { value: mockCompanyData.company_profile.productionCapacity.qualityControlStaff } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    // Check if production capacity data is included in submission
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          company_profile: expect.objectContaining({
            productionCapacity: mockCompanyData.company_profile.productionCapacity
          })
        })
      );
    });
  });

  it('handles social media fields correctly', async () => {
    const onSubmit = jest.fn();
    render(<CompanyForm {...defaultProps} onSubmit={onSubmit} />);

    // Fill in social media fields
    const linkedinInput = screen.getByLabelText(/linkedin profile/i);
    const twitterInput = screen.getByLabelText(/twitter profile/i);
    const facebookInput = screen.getByLabelText(/facebook profile/i);

    fireEvent.change(linkedinInput, { target: { value: mockCompanyData.company_profile.social_media.linkedin } });
    fireEvent.change(twitterInput, { target: { value: mockCompanyData.company_profile.social_media.twitter } });
    fireEvent.change(facebookInput, { target: { value: mockCompanyData.company_profile.social_media.facebook } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    // Check if social media data is included in submission
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          company_profile: expect.objectContaining({
            social_media: mockCompanyData.company_profile.social_media
          })
        })
      );
    });
  });

  // Add more test cases as needed
}); 