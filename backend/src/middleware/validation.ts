import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export interface OrderRequestBody {
  customerName: string;
  address: string;
  phone: string;
  items: Array<{
    menuItem: string;
    quantity: number;
  }>;
}

export const validateOrder = [
  body('customerName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  body('phone')
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Invalid phone number format'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),
  body('items.*.menuItem')
    .isHexadecimal()
    .isLength({ min: 24, max: 24 })
    .withMessage('Invalid menu item ID'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
      return;
    }
    next();
  }
];
