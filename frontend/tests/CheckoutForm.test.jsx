import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckoutForm } from '../src/components/CheckoutForm';

describe('CheckoutForm', () => {
  const mockCartItems = [
    { _id: '123', quantity: 2 }
  ];

  const mockCallbacks = {
    onSubmit: vi.fn(),
    onCancel: vi.fn()
  };

  it('renders form fields', () => {
    render(<CheckoutForm cartItems={mockCartItems} {...mockCallbacks} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm cartItems={mockCartItems} {...mockCallbacks} />);

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Address is required')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required')).toBeInTheDocument();
  });

  it('shows error for short name', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm cartItems={mockCartItems} {...mockCallbacks} />);

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, 'A');

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    expect(await screen.findByText('Name must be at least 2 characters')).toBeInTheDocument();
  });

  it('shows error for invalid phone format', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm cartItems={mockCartItems} {...mockCallbacks} />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.type(phoneInput, 'invalid');

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    expect(await screen.findByText('Invalid phone number format')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm cartItems={mockCartItems} {...mockCallbacks} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/delivery address/i), '123 Main St');
    await user.type(screen.getByLabelText(/phone number/i), '123-456-7890');

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCallbacks.onSubmit).toHaveBeenCalledWith({
        customerName: 'John Doe',
        address: '123 Main St',
        phone: '123-456-7890',
        items: [{ menuItem: '123', quantity: 2 }]
      });
    });
  });

  it('calls onCancel when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm cartItems={mockCartItems} {...mockCallbacks} />);

    const cancelButton = screen.getByRole('button', { name: /back to menu/i });
    await user.click(cancelButton);

    expect(mockCallbacks.onCancel).toHaveBeenCalled();
  });

  it('clears error when user starts typing', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm cartItems={mockCartItems} {...mockCallbacks} />);

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    expect(await screen.findByText('Name is required')).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, 'John');

    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });
});
