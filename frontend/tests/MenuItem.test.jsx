import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuItem } from '../src/components/MenuItem';

describe('MenuItem', () => {
  const mockItem = {
    _id: '123',
    name: 'Test Pizza',
    description: 'Delicious test pizza',
    price: 12.99,
    imageUrl: 'http://test.com/pizza.jpg'
  };

  const mockOnAddToCart = vi.fn();

  it('renders menu item details', () => {
    render(<MenuItem item={mockItem} onAddToCart={mockOnAddToCart} />);

    expect(screen.getByText('Test Pizza')).toBeInTheDocument();
    expect(screen.getByText('Delicious test pizza')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('renders image with correct src and alt', () => {
    render(<MenuItem item={mockItem} onAddToCart={mockOnAddToCart} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'http://test.com/pizza.jpg');
    expect(image).toHaveAttribute('alt', 'Test Pizza');
  });

  it('calls onAddToCart when button is clicked', async () => {
    const user = userEvent.setup();
    render(<MenuItem item={mockItem} onAddToCart={mockOnAddToCart} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    await user.click(button);

    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockItem);
  });
});
