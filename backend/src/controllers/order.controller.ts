import { Request, Response } from "express";
import Order, { IOrder, OrderStatus } from "../models/orderModel.js";
import MenuItem from "../models/menuItemModel.js";
import { OrderRequestBody } from "../middleware/validation.js";
import { getIO } from "../config/socket.js";

interface CreateOrderRequestBody extends OrderRequestBody {}

function notifyOrderUpdate(orderId: string, order: IOrder): void {
  const io = getIO();
  io.to(`order:${orderId}`).emit("order-update", order);
}

export const createOrder = async (
  req: Request<{}, {}, CreateOrderRequestBody>,
  res: Response,
): Promise<void> => {
  try {
    const { customerName, address, phone, items } = req.body;

    const menuItemIds = items.map((item) => item.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    const menuItemMap = new Map(
      menuItems.map((item) => [item._id.toString(), item]),
    );

    const orderItems = items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItem);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItem} not found`);
      }
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = new Order({
      customerName,
      address,
      phone,
      items: orderItems,
      totalAmount,
    });

    await order.save();

    notifyOrderUpdate(order._id.toString(), order);

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to create order",
    });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const order: IOrder | null = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const getOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const order: IOrder | null = await Order.findById(req.params.id).select(
      "status createdAt updatedAt",
    );
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order status" });
  }
};

export const startStatusSimulation = (): NodeJS.Timeout => {
  const statuses: OrderStatus[] = [
    OrderStatus.ORDER_RECEIVED,
    OrderStatus.PREPARING,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
  ];

  return setInterval(async () => {
    const orders = await Order.find({ status: { $ne: "Delivered" } });

    for (const order of orders) {
      const currentTime = Date.now();
      const lastUpdate = order.updatedAt.getTime();
      const timeSinceUpdate = currentTime - lastUpdate;

      if (timeSinceUpdate > 4000) {
        const currentIndex = statuses.indexOf(order.status);
        if (currentIndex < statuses.length - 1) {
          order.status = statuses[currentIndex + 1];
          await order.save();
          notifyOrderUpdate(order._id.toString(), order);
          console.log(`Order ${order._id} status updated to: ${order.status}`);
        }
      }
    }
  }, 5000);
};
