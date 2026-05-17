import { test, expect } from '@playwright/test';

test.describe('Menu & Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays menu items', async ({ page }) => {
    // Wait for menu items to load
    await page.locator('.menu-item').first().waitFor();

    // Check that menu items are displayed
    const menuItems = page.locator('.menu-item');
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('displays menu item details', async ({ page }) => {
    // Wait for menu items
    await page.locator('.menu-item').first().waitFor();

    // Check for item name, description, and price
    const firstItem = page.locator('.menu-item').first();
    await expect(firstItem.locator('.menu-item-name')).toBeVisible();
    await expect(firstItem.locator('.menu-item-description')).toBeVisible();
    await expect(firstItem.locator('.menu-item-price')).toBeVisible();
  });

  test('adds item to cart', async ({ page }) => {
    // Wait for menu items
    await page.locator('.menu-item').first().waitFor();

    // Checkout link should not be visible when cart is empty
    await expect(page.getByRole('link', { name: /checkout/i })).not.toBeVisible();

    // Click "Add to Cart" on first item
    await page.locator('.menu-item').first().getByRole('button', { name: /add to cart/i }).click();

    // Cart link should appear with count (1)
    await expect(page.getByRole('link', { name: /checkout/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /checkout/i })).toHaveText(/\(1\)/);

    // Cart section should appear
    await expect(page.locator('.cart-section')).toBeVisible();
  });

  test('adds multiple items to cart', async ({ page }) => {
    await page.locator('.menu-item').first().waitFor();

    // Add first item twice (same item, increases quantity)
    const firstItem = page.locator('.menu-item').first();
    await firstItem.getByRole('button', { name: /add to cart/i }).click();
    await firstItem.getByRole('button', { name: /add to cart/i }).click();

    // Add second different item
    await page.locator('.menu-item').nth(1).getByRole('button', { name: /add to cart/i }).click();

    // Cart count shows unique items (2), not total quantity (3)
    await expect(page.getByRole('link', { name: /checkout/i })).toHaveText(/\(2\)/);
  });

  test('displays cart items correctly', async ({ page }) => {
    await page.locator('.menu-item').first().waitFor();

    // Add an item to cart
    await page.locator('.menu-item').first().getByRole('button', { name: /add to cart/i }).click();

    // Check cart is visible
    await expect(page.locator('.cart-section')).toBeVisible();

    // Check item details in cart
    await expect(page.locator('.cart-item')).toBeVisible();
    await expect(page.locator('.cart-item-info')).toBeVisible();
  });

  test('increases item quantity in cart', async ({ page }) => {
    await page.locator('.menu-item').first().waitFor();

    // Add item to cart
    await page.locator('.menu-item').first().getByRole('button', { name: /add to cart/i }).click();

    // Click + button in cart
    await page.locator('.cart-item').getByRole('button', { name: '+' }).click();

    // Quantity should be 2 - check by counting cart items with quantity 2
    const cartItems = page.locator('.cart-item');
    const firstCartItem = cartItems.first();
    const quantitySpan = firstCartItem.locator('.cart-item-controls span');
    await expect(quantitySpan).toHaveText('2');
  });

  test('decreases item quantity in cart', async ({ page }) => {
    await page.locator('.menu-item').first().waitFor();

    // Add item twice
    const firstItem = page.locator('.menu-item').first();
    await firstItem.getByRole('button', { name: /add to cart/i }).click();
    await firstItem.getByRole('button', { name: /add to cart/i }).click();

    // Click - button in cart
    await page.locator('.cart-item').getByRole('button', { name: '-' }).click();

    // Quantity should be 1
    const quantitySpan = page.locator('.cart-item-controls span');
    await expect(quantitySpan).toHaveText('1');
  });

  test('removes item from cart', async ({ page }) => {
    await page.locator('.menu-item').first().waitFor();

    // Add item to cart
    await page.locator('.menu-item').first().getByRole('button', { name: /add to cart/i }).click();

    // Verify cart is visible
    await expect(page.locator('.cart-section')).toBeVisible();

    // Click remove button
    await page.locator('.cart-item').getByRole('button', { name: /remove/i }).click();

    // Cart section should disappear (cart is empty)
    await expect(page.locator('.cart-section')).not.toBeVisible();

    // Checkout link should also disappear
    await expect(page.getByRole('link', { name: /checkout/i })).not.toBeVisible();
  });

  test('calculates cart total correctly', async ({ page }) => {
    await page.locator('.menu-item').first().waitFor();

    // Add first item twice
    const firstItem = page.locator('.menu-item').first();
    await firstItem.getByRole('button', { name: /add to cart/i }).click();
    await firstItem.getByRole('button', { name: /add to cart/i }).click();

    // Get the price from menu item
    const priceText = await firstItem.locator('.menu-item-price').textContent();
    const price = parseFloat(priceText.replace('$', ''));

    // Expected total: price * 2
    const expectedTotal = (price * 2).toFixed(2);

    // Check total in cart
    await expect(page.locator('.cart-total')).toContainText(expectedTotal);
  });

  test('does not allow quantity below 1', async ({ page }) => {
    await page.locator('.menu-item').first().waitFor();

    // Add item to cart
    await page.locator('.menu-item').first().getByRole('button', { name: /add to cart/i }).click();

    // - button should be disabled when quantity is 1
    const minusButton = page.locator('.cart-item').getByRole('button', { name: '-' });
    await expect(minusButton).toBeDisabled();
  });
});

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();

    // Add items to cart
    await page.locator('.menu-item').first().getByRole('button', { name: /add to cart/i }).click();
  });

  test('navigates to checkout page', async ({ page }) => {
    // Click checkout button
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Should be on checkout page
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByRole('heading', { name: /checkout/i })).toBeVisible();
  });

  test('disables checkout when cart is empty', async ({ page }) => {
    // Remove item from cart
    await page.locator('.cart-item').getByRole('button', { name: /remove/i }).click();

    // Checkout button should not be visible (cart section hidden)
    await expect(page.getByRole('button', { name: /proceed to checkout/i })).not.toBeVisible();
  });

  test('shows validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Submit empty form
    await page.getByRole('button', { name: /place order/i }).click();

    // Should show validation errors
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Address is required')).toBeVisible();
    await expect(page.getByText('Phone number is required')).toBeVisible();
  });

  test('shows error for short name', async ({ page }) => {
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Enter short name
    await page.getByLabel(/^full name/i).fill('A');
    await page.getByRole('button', { name: /place order/i }).click();

    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
  });

  test('shows error for invalid phone format', async ({ page }) => {
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Enter invalid phone
    await page.getByLabel(/^phone number/i).fill('invalid');
    await page.getByRole('button', { name: /place order/i }).click();

    await expect(page.getByText('Invalid phone number format')).toBeVisible();
  });

  test('clears error when user starts typing', async ({ page }) => {
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Submit empty form to trigger errors
    await page.getByRole('button', { name: /place order/i }).click();
    await expect(page.getByText('Name is required')).toBeVisible();

    // Start typing in name field
    await page.getByLabel(/^full name/i).fill('John');

    // Error should disappear
    await expect(page.getByText('Name is required')).not.toBeVisible();
  });

  test('submits order successfully', async ({ page }) => {
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Fill form
    await page.getByLabel(/^full name/i).fill('John Doe');
    await page.getByLabel(/^delivery address/i).fill('123 Main Street, City, Country');
    await page.getByLabel(/^phone number/i).fill('123-456-7890');

    // Submit
    await page.getByRole('button', { name: /place order/i }).click();

    // Should navigate to order status page
    await expect(page).toHaveURL(/\/order\/[a-f0-9]+/);
    await expect(page.getByRole('heading', { name: /order status/i })).toBeVisible();
  });

  test('cancels checkout and returns to menu', async ({ page }) => {
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Click back button
    await page.getByRole('button', { name: /back to menu/i }).click();

    // Should return to home page
    await expect(page).toHaveURL('/');

    // Menu items should be visible
    await expect(page.locator('.menu-item').first()).toBeVisible();
  });
});

test.describe('Order Status Page', () => {
  test('displays order status', async ({ page }) => {
    // First create an order
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();
    await page.locator('.menu-item').first().getByRole('button', { name: /add to cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();
    await page.getByLabel(/^full name/i).fill('John Doe');
    await page.getByLabel(/^delivery address/i).fill('123 Main St');
    await page.getByLabel(/^phone number/i).fill('123-456-7890');
    await page.getByRole('button', { name: /place order/i }).click();

    // Wait for order status page
    await expect(page.getByRole('heading', { name: /order status/i })).toBeVisible();

    // Check order details are displayed
    await expect(page.locator('.order-details')).toBeVisible();
    await expect(page.getByText(/John Doe/)).toBeVisible();
    await expect(page.getByText(/123 Main St/)).toBeVisible();
  });

  test('displays order items in status page', async ({ page }) => {
    // Create an order
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();
    await page.locator('.menu-item').first().getByRole('button', { name: /add to cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();
    await page.getByLabel(/^full name/i).fill('Jane Doe');
    await page.getByLabel(/^delivery address/i).fill('456 Oak Ave');
    await page.getByLabel(/^phone number/i).fill('987-654-3210');
    await page.getByRole('button', { name: /place order/i }).click();

    // Check order details section
    await expect(page.locator('.order-details')).toBeVisible();

    // Check that items list exists (it's a ul with li children)
    await expect(page.locator('.order-details ul')).toBeVisible();
  });

  test('shows current order status', async ({ page }) => {
    // Create an order
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();
    await page.locator('.menu-item').first().getByRole('button', { name: /add to cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();
    await page.getByLabel(/^full name/i).fill('Test User');
    await page.getByLabel(/^delivery address/i).fill('789 Test Lane');
    await page.getByLabel(/^phone number/i).fill('555-123-4567');
    await page.getByRole('button', { name: /place order/i }).click();

    // Status indicator should be visible
    await expect(page.locator('.status-progress')).toBeVisible();
    await expect(page.locator('.status-step').first()).toBeVisible();
  });
});

test.describe('Complete User Journey', () => {
  test('full order flow: browse to delivery', async ({ page }) => {
    // 1. Browse menu
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();

    // 2. Add multiple items
    await page.locator('.menu-item').nth(0).getByRole('button', { name: /add to cart/i }).click();
    await page.locator('.menu-item').nth(1).getByRole('button', { name: /add to cart/i }).click();
    await page.locator('.menu-item').nth(0).getByRole('button', { name: /add to cart/i }).click();

    // Verify cart count (unique items, not total quantity)
    await expect(page.getByRole('link', { name: /checkout/i })).toHaveText(/\(2\)/);

    // 3. Update quantities
    await page.locator('.cart-item').nth(0).getByRole('button', { name: '+' }).click();
    const quantitySpan = page.locator('.cart-item').nth(0).locator('.cart-item-controls span');
    await expect(quantitySpan).toHaveText('3');

    // 4. Proceed to checkout
    await page.getByRole('button', { name: /proceed to checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    // 5. Fill checkout form
    await page.getByLabel(/^full name/i).fill('Alice Johnson');
    await page.getByLabel(/^delivery address/i).fill('100 Food Street, Delivery City');
    await page.getByLabel(/^phone number/i).fill('111-222-3333');

    // 6. Place order
    await page.getByRole('button', { name: /place order/i }).click();

    // 7. Verify order status page
    await expect(page).toHaveURL(/\/order\/[a-f0-9]+/);
    await expect(page.getByRole('heading', { name: /order status/i })).toBeVisible();
    await expect(page.getByText(/Alice Johnson/)).toBeVisible();
    await expect(page.getByText(/100 Food Street/)).toBeVisible();
  });
});
