import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cart } from '../src/components/Cart';

describe('Cart', () => {
  const mockItems = [
    { _id: '1', name: 'Pizza', price: 12.99, quantity: 2 },
    { _id: '2', name: 'Burger', price: 8.99, quantity: 1 }
  ];

  const mockCallbacks = {
    onUpdateQuantity: vi.fn(),
    onRemove: vi.fn(),
    onCheckout: vi.fn()
  };

  it('renders empty cart message when no items', () => {
    render(<Cart items={[]} {...mockCallbacks} />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders cart items', () => {
    render(<Cart items={mockItems} {...mockCallbacks} />);

    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('$12.99 each')).toBeInTheDocument();
    expect(screen.getByText('$8.99 each')).toBeInTheDocument();
  });

  it('displays correct quantities', () => {
    render(<Cart items={mockItems} {...mockCallbacks} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calculates total correctly', () => {
    render(<Cart items={mockItems} {...mockCallbacks} />);

    // Total: (12.99 * 2) + (8.99 * 1) = 25.98 + 8.99 = 34.97
    expect(screen.getByText('Total: $34.97')).toBeInTheDocument();
  });
  

  it('calls onUpdateQuantity when + button is clicked', async () => {
    const user = userEvent.setup();
    render(<Cart items={mockItems} {...mockCallbacks} />);

    const plusButtons = screen.getAllByText('+');
    await user.click(plusButtons[0]);

    expect(mockCallbacks.onUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<Cart items={mockItems} {...mockCallbacks} />);

    const removeButtons = screen.getAllByText('Remove');
    await user.click(removeButtons[0]);

    expect(mockCallbacks.onRemove).toHaveBeenCalledWith('1');
  });

  it('calls onCheckout when checkout button is clicked', async () => {
    const user = userEvent.setup();
    render(<Cart items={mockItems} {...mockCallbacks} />);

    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    await user.click(checkoutButton);

    expect(mockCallbacks.onCheckout).toHaveBeenCalled();
  });

  it('disables - button when quantity is 1', () => {
    render(<Cart items={mockItems} {...mockCallbacks} />);

    const minusButtons = screen.getAllByText('-');
    // Burger has quantity 1, so its - button should be disabled
    expect(minusButtons[1]).toBeDisabled();
  });
});
