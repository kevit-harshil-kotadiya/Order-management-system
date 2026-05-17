import { Request, Response } from 'express';
import MenuItem, { IMenuItem } from '../models/menuItemModel.js';

export const getAllMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const menuItems: IMenuItem[] = await MenuItem.find().sort({ name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

export const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const menuItem: IMenuItem | null = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
};

export const seedMenuItems = async (): Promise<void> => {
  const count = await MenuItem.countDocuments();
  if (count > 0) return;

  const menuItems: Partial<IMenuItem>[] = [
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: 12.99,
      imageUrl: 'https://picsum.photos/400/300?random=1',
    },
    {
      name: 'Pepperoni Pizza',
      description: 'Pizza topped with pepperoni slices and extra cheese',
      price: 14.99,
      imageUrl: 'https://picsum.photos/400/300?random=2',
    },
    {
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, and special sauce',
      price: 10.99,
      imageUrl: 'https://picsum.photos/400/300?random=3',
    },
    {
      name: 'Cheese Burger',
      description: 'Double patty burger with cheddar cheese',
      price: 12.99,
      imageUrl: 'https://picsum.photos/400/300?random=4',
    },
    {
      name: 'Caesar Salad',
      description: 'Crispy romaine lettuce with Caesar dressing and croutons',
      price: 8.99,
      imageUrl: 'https://picsum.photos/400/300?random=5',
    },
    {
      name: 'Chicken Wings',
      description: 'Spicy buffalo wings with ranch dipping sauce',
      price: 11.99,
      imageUrl: 'https://picsum.photos/400/300?random=6',
    },
    {
      name: 'French Fries',
      description: 'Crispy golden fries with sea salt',
      price: 4.99,
      imageUrl: 'https://picsum.photos/400/300?random=7',
    },
    {
      name: 'Chocolate Shake',
      description: 'Rich and creamy chocolate milkshake',
      price: 6.99,
      imageUrl: 'https://picsum.photos/400/300?random=8',
    },
    {
      name: 'Soda',
      description: 'Refreshing cola drink',
      price: 2.49,
      imageUrl: 'https://picsum.photos/400/300?random=9',
    },
    {
      name: 'Iced Tea',
      description: 'Freshly brewed iced tea with lemon',
      price: 2.99,
      imageUrl: 'https://picsum.photos/400/300?random=10',
    },
  ];

  await MenuItem.insertMany(menuItems);
  console.log('Menu items seeded successfully');
};
