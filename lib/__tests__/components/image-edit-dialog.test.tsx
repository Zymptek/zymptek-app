import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageEditDialog } from '@/components/shared/ImageEditDialog';
import userEvent from '@testing-library/user-event';

// Mock the upload function
jest.mock('@/lib/utils/upload', () => ({
  uploadToSupabase: jest.fn(() => Promise.resolve('https://example.com/uploaded-image.jpg')),
}));

describe('ImageEditDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    title: 'Edit Image',
    description: 'Upload or edit your image',
    currentImage: 'https://example.com/current-image.jpg',
    onSave: jest.fn(),
    aspectRatio: 'square' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog with current image', () => {
    render(<ImageEditDialog {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', defaultProps.currentImage);
  });

  it('renders placeholder when no current image', () => {
    render(<ImageEditDialog {...defaultProps} currentImage={null} />);

    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to upload/i)).toBeInTheDocument();
  });

  it('handles image upload', async () => {
    render(<ImageEditDialog {...defaultProps} />);

    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload image/i) as HTMLInputElement;

    await userEvent.upload(input, file);

    expect(input.files?.[0]).toBe(file);
    expect(input.files?.length).toBe(1);
  });

  it('validates file type', async () => {
    render(<ImageEditDialog {...defaultProps} />);

    const file = new File(['test file'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/upload image/i) as HTMLInputElement;

    await userEvent.upload(input, file);

    expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
  });

  it('validates file size', async () => {
    render(<ImageEditDialog {...defaultProps} />);

    // Create a file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload image/i) as HTMLInputElement;

    await userEvent.upload(input, largeFile);

    expect(screen.getByText(/file size must be less than 5mb/i)).toBeInTheDocument();
  });

  it('handles save with new image', async () => {
    render(<ImageEditDialog {...defaultProps} />);

    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload image/i) as HTMLInputElement;

    await userEvent.upload(input, file);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith('https://example.com/uploaded-image.jpg');
    });
  });

  it('handles save with existing image', async () => {
    render(<ImageEditDialog {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith(defaultProps.currentImage);
    });
  });

  it('handles image removal', async () => {
    render(<ImageEditDialog {...defaultProps} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith(null);
    });
  });

  it('shows loading state during upload', async () => {
    // Mock a delayed upload
    const uploadToSupabase = jest.requireMock('@/lib/utils/upload').uploadToSupabase;
    uploadToSupabase.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<ImageEditDialog {...defaultProps} />);

    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload image/i) as HTMLInputElement;

    await userEvent.upload(input, file);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('handles upload errors', async () => {
    // Mock an upload error
    const uploadToSupabase = jest.requireMock('@/lib/utils/upload').uploadToSupabase;
    uploadToSupabase.mockRejectedValueOnce(new Error('Upload failed'));

    render(<ImageEditDialog {...defaultProps} />);

    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload image/i) as HTMLInputElement;

    await userEvent.upload(input, file);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to upload image/i)).toBeInTheDocument();
    });
  });

  it('closes dialog when cancel is clicked', () => {
    render(<ImageEditDialog {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports different aspect ratios', () => {
    render(<ImageEditDialog {...defaultProps} aspectRatio="wide" />);

    const cropArea = screen.getByRole('img').parentElement;
    expect(cropArea).toHaveStyle({ aspectRatio: '16/9' });
  });

  // Add more test cases as needed
}); 